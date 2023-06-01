import type { Token } from '@rarimo/bridge'
import {
  Amount,
  BUNDLE_SALT_BYTES,
  isUndefined,
  MASTER_ROUTER_ABI,
  toLowerCase as lc,
  TransactionBundle,
} from '@rarimo/shared'
import { utils } from 'ethers'

import {
  CALLER_ADDRESS,
  CONTRACT_BALANCE,
  THIS_ADDRESS,
  WRAPPED_CHAIN_TOKEN_SYMBOLS as wrapped,
} from '@/const'
import { SwapCommands as cmds } from '@/enums'
import type { ExecuteArgs } from '@/types'

import { buildPayload as cmd } from './payload-builder'

type CommandPayload = {
  command: cmds
  skipRevert: boolean
  data: string
}

export const getExecuteData = (args: ExecuteArgs): string => {
  const {
    from,
    to,
    amountIn,
    amountOut,
    chainTo,
    receiver = CALLER_ADDRESS,
  } = args

  const data = []

  const isBridgingRequired = Number(from.chain.id) !== Number(chainTo?.id)
  const isSameChainBundleExecution = Boolean(args.bundle?.bundle)

  const isWrapRequired =
    from.isNative && lc(wrapped[Number(from.chain.id)]) === lc(to.symbol)

  const isUnwrapRequired =
    lc(wrapped[Number(from.chain.id)]) === lc(from.symbol) &&
    lc(to.symbol) === lc(to.chain.token.symbol)

  const isWrappedOrUnwrapped = isUnwrapRequired || isWrapRequired

  // If bridging is required or if there is same chain bundle execution,
  // tokens must be on the swap contract balance.
  // During swapping tokens swap contract will be receiver by default.
  const rcvr =
    isBridgingRequired || isSameChainBundleExecution ? THIS_ADDRESS : receiver

  // If wrap of the native token is required
  if (isWrapRequired) {
    data.push(cmd(cmds.WrapNative, [rcvr, amountIn.value]))
  }

  // If input not native token transfer erc20 to the contract balance is required
  if (!from.isNative) {
    data.push(cmd(cmds.TransferFromErc20, [from.address, amountIn.value]))
  }

  // If unwrap required and native is the target token
  if (isUnwrapRequired) {
    data.push(cmd(cmds.UnwrapNative, [rcvr, amountIn.value]))
  }

  // If input token wasn't wrapped\unwrapped thus swap is required, and we need to
  // add swap data such as: native -> erc20 | erc20 -> native | erc20 -> erc20

  if (!isWrappedOrUnwrapped) {
    if (!args.path || !amountOut) {
      throw new TypeError('path,amountOut args are required for swap')
    }

    data.push(...getSwapData(from, to, amountIn, amountOut, args.path))

    // If to.isNative swap output token we need to unwrap it for UniswapV3
    if (isSameChainBundleExecution && to.isNative && to.isUniswapV3) {
      data.push(cmd(cmds.UnwrapNative, [THIS_ADDRESS, amountOut.value]))
    }
  }

  // If token was wrapped\unwrapped thus amount for bridging equals to amountIn
  // and amountOut could be undefined otherwise if token was swapped we need
  // to take amountOut as amount for bridging\transferring
  const amount = isWrappedOrUnwrapped ? amountIn : amountOut!

  data.push(...getBridgeData(isBridgingRequired, args, to, receiver, amount))

  // If bridging is not required and bundle is provided, thus we need to execute
  // bundle on the same chain
  data.push(...getSameChainBundleData(isBridgingRequired, args.bundle))

  // If token wasn't bridged thus transfer to the receiver is required
  // otherwise we will transfer change after swap operation which should be 0
  // but better to be sure that all tokens was transferred to the receiver
  data.push(
    ...getTransferData(
      to,
      amount,
      receiver,
      isBridgingRequired,
      isSameChainBundleExecution,
    ),
  )

  return new utils.Interface(MASTER_ROUTER_ABI).encodeFunctionData('make', [
    data,
  ])
}

const getSwapData = (
  from: Token,
  to: Token,
  amountIn: Amount,
  amountOut: Amount,
  path: string | string[],
): CommandPayload[] => {
  const data = []

  const swapValues = [
    THIS_ADDRESS,
    ...(from.isNative ? [amountIn.value] : [amountOut.value]),
    ...(from.isNative ? [amountOut.value] : [amountIn.value]),
    path,
  ]

  if (from.isUniswapV2) {
    let command = from.isTraderJoe
      ? cmds.SwapTokensForExactTokensTj
      : cmds.SwapTokensForExactTokensV2

    if (from.isNative) {
      command = from.isTraderJoe
        ? cmds.SwapExactAvaxForTokens
        : cmds.SwapExactEthForTokens
    }
    if (to.isNative) {
      command = from.isTraderJoe
        ? cmds.SwapTokensForExactAvax
        : cmds.SwapTokensForExactEth
    }

    data.push(cmd(command, swapValues))
  }

  if (from.isUniswapV3) {
    const command = from.isNative ? cmds.ExactInput : cmds.ExactOutput

    data.push(cmd(command, [from.isNative, ...swapValues]))
  }

  return data
}

const getBridgeData = (
  isBridgingRequired: boolean,
  args: ExecuteArgs,
  to: Token,
  receiver: string,
  amountOut: Amount,
): CommandPayload[] => {
  if (!isBridgingRequired) return []

  if (!args.chainTo || isUndefined(args.isWrapped)) {
    throw new TypeError('chainTo, isWrapped args are required for bridging')
  }

  const bundleTuple = [
    args.bundle?.salt || utils.hexlify(utils.randomBytes(BUNDLE_SALT_BYTES)),
    args.bundle?.bundle ?? '0x',
  ]

  return [
    cmd(to.isNative ? cmds.BridgeNative : cmds.BridgeErc20, [
      ...(to.isNative ? [] : [to.address]),
      amountOut.value,
      bundleTuple,
      args.chainTo.name,
      receiver ?? CALLER_ADDRESS,
      ...(to.isNative ? [] : [args.isWrapped]),
    ]),
  ]
}

const getTransferData = (
  to: Token,
  amount: Amount,
  receiver: string,
  isBridgingRequired: boolean,
  isSameChainBundleExecution: boolean,
): CommandPayload[] => {
  const command = to.isNative ? cmds.TransferNative : cmds.TransferErc20
  const token = to.isNative ? [] : [to.address]

  // first time we transfer required amount of the tokens to the receiver is bridging
  // not required second time to be sure that swap contract balance is empty we
  // transfer change to the caller
  return [
    ...(isBridgingRequired || isSameChainBundleExecution
      ? []
      : [cmd(command, [...token, receiver, amount.value])]),
    cmd(command, [...token, CALLER_ADDRESS, CONTRACT_BALANCE]),
  ]
}

const getSameChainBundleData = (
  isBridgingRequired: boolean,
  { bundle } = {} as TransactionBundle,
): CommandPayload[] => {
  if (isBridgingRequired || !bundle) return []

  // to execute transaction bundle on the same chain we need to use multicall
  return [
    {
      command: cmds.Multicall,
      skipRevert: false,
      data: bundle,
    },
  ]
}

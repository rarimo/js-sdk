import type { Token } from '@rarimo/bridge'
import {
  Amount,
  BridgeChain,
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

  const isBridgingRequired = from.chain.id != chainTo?.id
  // if bridging is required, we need to transfer tokens to the bridge contract
  // from the swap contract after wrap\unwrap. During swapping tokens swap contract
  // will be receiver by default
  const rcvr = isBridgingRequired ? THIS_ADDRESS : receiver
  const isWrapRequired =
    from.isNative && lc(wrapped[Number(from.chain.id)]) === lc(to.symbol)

  // if wrap of the native token is required
  if (isWrapRequired) {
    data.push(cmd(cmds.WrapNative, [rcvr, amountIn.value]))
  }

  // if input not native token transfer erc20 to the contract balance is required
  if (!from.isNative) {
    data.push(cmd(cmds.TransferFromErc20, [from.address, amountIn.value]))
  }

  const isUnwrapRequired =
    lc(wrapped[+from.chain.id]) === lc(from.symbol) &&
    lc(to.symbol) === lc(to.chain.token.symbol) // TODO: recheck this

  // if unwrap required and native is the target token
  if (isUnwrapRequired) {
    data.push(cmd(cmds.UnwrapNative, [rcvr, amountIn.value]))
  }

  // if input token wasn't wrapped\unwrapped thus swap is required, and we need to
  // add swap data such as: native -> erc20 | erc20 -> native | erc20 -> erc20
  const isWrappedOrUnwrapped = isUnwrapRequired || isWrapRequired

  if (!isWrappedOrUnwrapped) {
    if (!args.path || !amountOut) {
      throw new TypeError('path,amountOut args are required for swap')
    }

    data.push(...getSwapData(from, to, amountIn, amountOut, args.path))
  }

  if (!args.chainTo || isUndefined(args.isWrapped)) {
    throw new TypeError('chainTo, isWrapped args are required for bridging')
  }

  // If token was wrapped\unwrapped thus amount for bridging equals to amountIn
  // and amountOut could be undefined otherwise if token was swapped we need
  // to take amountOut as amount for bridging\transferring
  const amount = isWrappedOrUnwrapped ? amountIn : amountOut!

  if (isBridgingRequired) {
    data.push(
      getBridgeData(
        to,
        receiver,
        amount,
        args.chainTo,
        args.isWrapped,
        args.bundle,
      ),
    )
  }

  // if token wasn't bridged thus transfer to the receiver is required
  // otherwise we will transfer change after swap operation which should be 0
  // but better to be sure that all tokens was transferred to the receiver
  data.push(...getTransferData(to, amount, receiver, isBridgingRequired))

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

  if (from.isV2) {
    const fromNativeCommand = from.isTraderJoe
      ? cmds.SwapExactAvaxForTokens
      : cmds.SwapExactEthForTokens

    const toNativeCommand = from.isTraderJoe
      ? cmds.SwapTokensForExactAvax
      : cmds.SwapTokensForExactEth

    const tokensCommand = from.isTraderJoe
      ? cmds.SwapTokensForExactTokensTj
      : cmds.SwapTokensForExactTokensV2

    const command = from.isNative
      ? fromNativeCommand
      : to.isNative
      ? toNativeCommand
      : tokensCommand

    data.push(cmd(command, swapValues))
  }

  if (from.isUniswapV3) {
    const command = from.isNative ? cmds.ExactInput : cmds.ExactOutput

    data.push(cmd(command, [from.isNative || to.isNative, ...swapValues]))
  }

  return data
}

const getBridgeData = (
  to: Token,
  receiver: string,
  amountOut: Amount,
  chainTo: BridgeChain,
  isWrapped: boolean,
  bundle?: TransactionBundle,
): CommandPayload => {
  const bundleTuple = [
    bundle?.salt || utils.hexlify(utils.randomBytes(BUNDLE_SALT_BYTES)),
    bundle?.bundle ?? '',
  ]

  return cmd(to.isNative ? cmds.BridgeNative : cmds.BridgeErc20, [
    ...(to.isNative ? [] : [to.address]),
    amountOut.value,
    bundleTuple,
    chainTo.name,
    receiver ?? CALLER_ADDRESS,
    ...(to.isNative ? [] : [isWrapped]),
  ])
}

const getTransferData = (
  to: Token,
  amount: Amount,
  receiver: string,
  isBridgingRequired: boolean,
): CommandPayload[] => {
  const command = to.isNative ? cmds.TransferNative : cmds.TransferErc20
  const token = to.isNative ? [] : [to.address]

  // first time we transfer required amount of the tokens to the receiver is bridging
  // not required second time to be sure that swap contract balance is empty we
  // transfer change to the caller
  return [
    ...(isBridgingRequired
      ? []
      : [cmd(command, [...token, receiver, amount.value])]),
    cmd(command, [...token, CALLER_ADDRESS, CONTRACT_BALANCE]),
  ]
}

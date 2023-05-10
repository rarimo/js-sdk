import type { Token } from '@rarimo/bridge'
import {
  Amount,
  BUNDLE_SALT_BYTES,
  MASTER_ROUTER_ABI,
  TxBundle,
} from '@rarimo/shared'
import { utils } from 'ethers'

import {
  CALLER_ADDRESS,
  CONTRACT_BALANCE,
  THIS_ADDRESS,
  WRAPPED_CHAIN_TOKEN_SYMBOLS,
} from '@/const'
import { SwapCommands } from '@/enums'
import type { ExecuteArgs } from '@/types'

import { buildPayload } from './payload-builder'

type CommandPayload = {
  command: SwapCommands
  skipRevert: boolean
  data: string
}

const cmds = SwapCommands
const cmd = buildPayload
const lc = (str?: string) => str?.toLowerCase() ?? ''
const wrapped = WRAPPED_CHAIN_TOKEN_SYMBOLS

export const getExecuteData = (args: ExecuteArgs): string => {
  const { from, to, amountIn, amountOut, receiver = CALLER_ADDRESS } = args

  // We don't cover simple bridge flow here
  if (lc(from.symbol) == lc(to.symbol)) {
    throw new Error('Tokens must be different')
  }

  const data = []

  const isBridgingRequired = from.chain.id != to.chain.id
  // if bridging is required, we need to transfer tokens to the bridge contract
  // from the swap contract after wrap\unwrap. During swapping tokens swap contract
  // will be receiver by default
  const rcvr = isBridgingRequired ? THIS_ADDRESS : receiver
  const isWrapRequired = lc(wrapped[Number(from.chain.id)]) === lc(to.symbol)

  // if wrap of the native token is required
  if (from.isNative && isWrapRequired) {
    data.push(cmd(cmds.WrapNative, [rcvr, amountIn.value]))
  }

  // if input not native token transfer erc20 to the contract balance is required
  if (!from.isNative) {
    data.push(cmd(cmds.TransferErc20, [from.address, amountIn.value]))
  }

  const isUnwrapRequired =
    lc(wrapped[+from.chain.id]) === lc(from.symbol) &&
    lc(to.symbol) === lc(to.chain.token.symbol)

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

  if (!args.chainTo) {
    throw new TypeError('chainTo is required for bridging')
  }

  // If token was wrapped\unwrapped thus amount for bridging equals to amountIn
  // and amountOut could be undefined otherwise if token was swapped we need
  // to take amountOut as amount for bridging\transferring
  const amount = isWrappedOrUnwrapped ? amountIn : amountOut!

  if (isBridgingRequired) {
    data.push(getBridgeData(to, receiver, amount, args.chainTo, args.bundle))
  }

  // if token wasn't bridged thus transfer to the receiver is required
  // otherwise we will transfer change after swap operation which should be 0
  // but better to be sure that all tokens was transferred to the receiver
  data.push(...getTransferData(to, amount, receiver))

  return new utils.Interface(MASTER_ROUTER_ABI).encodeFunctionData('swap', data)
}

const getSwapData = (
  from: Token,
  to: Token,
  amountIn: Amount,
  amountOut: Amount,
  path: string[],
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
  chainTo: string,
  bundle?: TxBundle,
): CommandPayload => {
  const bundleTuple = [
    bundle?.salt || utils.hexlify(utils.randomBytes(BUNDLE_SALT_BYTES)),
    bundle?.bundle ?? '',
  ]

  return cmd(to.isNative ? cmds.BridgeNative : cmds.BridgeErc20, [
    ...(to.isNative ? [] : [to.address]),
    amountOut.value,
    bundleTuple,
    chainTo,
    receiver ?? CALLER_ADDRESS,
  ])
}

const getTransferData = (
  to: Token,
  amount: Amount,
  receiver: string,
): CommandPayload[] => {
  const command = to.isNative ? cmds.TransferNative : cmds.TransferErc20
  const token = to.isNative ? [] : [to.address]

  // first time we transfer required amount of the tokens to the receiver
  // second time to be sure that swap contract balance is empty we transfer
  // change to the caller
  return [
    cmd(command, [...token, receiver, amount.value]),
    cmd(command, [...token, CALLER_ADDRESS, CONTRACT_BALANCE]),
  ]
}

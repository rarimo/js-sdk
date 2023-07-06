import type { Token } from '@rarimo/bridge'
import { Amount, type TransactionBundle } from '@rarimo/shared'

import { CALLER_ADDRESS, THIS_ADDRESS } from '@/const'
import { SwapCommands } from '@/enums'
import type { CommandPayload, SwapOpts } from '@/types'

import { getIsWrappedOrUnwrappedRequired } from './helpers'
import { buildPayload } from './payload'

export const getSwapData = (
  isBridgingRequired: boolean,
  args: SwapOpts,
  receiver = CALLER_ADDRESS,
  bundle?: TransactionBundle,
): CommandPayload[] => {
  const data = []
  const isSameChainBundleExecution = Boolean(bundle?.bundle)

  const { from, to, amountIn, amountOut } = args

  const { isUnwrapRequired, isWrapRequired } = getIsWrappedOrUnwrappedRequired(
    from,
    to,
  )
  const isWrappedOrUnwrapped = isWrapRequired || isUnwrapRequired

  // If bridging is required or if there is same chain bundle execution,
  // tokens must be on the swap-contract balance.
  // During swapping tokens swap contract will be receiver by default.
  const rcvr =
    isBridgingRequired || isSameChainBundleExecution ? THIS_ADDRESS : receiver

  // If wrap of the native token is required
  if (isWrapRequired) {
    data.push(buildPayload(SwapCommands.WrapNative, [rcvr, amountIn.value]))
  }

  // If input not native token transfer erc20 to the contract balance is required
  if (!from.isNative) {
    data.push(
      buildPayload(SwapCommands.TransferFromErc20, [
        from.address,
        amountIn.value,
      ]),
    )
  }

  // If unwrap required and native is the target token
  if (isUnwrapRequired) {
    data.push(buildPayload(SwapCommands.UnwrapNative, [rcvr, amountIn.value]))
  }

  // If input token wasn't wrapped\unwrapped thus swap is required, and we need to
  // add swap data such as native -> erc20 | erc20 -> native | erc20 -> erc20

  if (!isWrappedOrUnwrapped) {
    if (!args.path || !amountOut) {
      throw new TypeError('path, amountOut args are required for swap')
    }

    data.push(...buildSwapData(from, to, amountIn, amountOut, args.path))

    // If to.isNative swap output token, we need to unwrap it for UniswapV3
    if (isSameChainBundleExecution && to.isNative && to.isUniswapV3) {
      data.push(
        buildPayload(SwapCommands.UnwrapNative, [
          THIS_ADDRESS,
          amountOut.value,
        ]),
      )
    }
  }

  return data
}

export const buildSwapData = (
  from: Token,
  to: Token,
  amountIn: Amount,
  amountOut: Amount,
  path: string[],
): CommandPayload[] => {
  const data = []

  const swapValues = [
    THIS_ADDRESS,
    amountOut.value,
    amountIn.value,
    // path type is different for UniswapV2 and UniswapV3 routers,
    // for the V3 router it is `address[]`, for the V2 router it is `bytes`
    // (concatenated addresses)
    from.isUniswapV2 ? path : path[0],
  ]

  if (from.isUniswapV2) {
    let command = from.isTraderJoe
      ? SwapCommands.SwapTokensForExactTokensTj
      : SwapCommands.SwapTokensForExactTokensV2

    if (from.isNative) {
      command = from.isTraderJoe
        ? SwapCommands.SwapAvaxForExactTokens
        : SwapCommands.SwapEthForExactTokens
    }
    if (to.isNative) {
      command = from.isTraderJoe
        ? SwapCommands.SwapTokensForExactAvax
        : SwapCommands.SwapTokensForExactEth
    }

    data.push(buildPayload(command, swapValues))
  }

  if (from.isUniswapV3) {
    const command = SwapCommands.ExactOutput
    // from.isNative determines for the UniswapV3 router, does input token be
    // native or not
    data.push(buildPayload(command, [from.isNative, ...swapValues]))
  }

  return data
}

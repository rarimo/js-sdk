import type { Token } from '@rarimo/bridge'
import type { TransactionBundle } from '@rarimo/shared'
import {
  Amount,
  BUNDLE_SALT_BYTES,
  isArray,
  isUndefined,
  MASTER_ROUTER_ABI,
  toLowerCase,
} from '@rarimo/shared'
import { utils } from 'ethers'

import {
  CALLER_ADDRESS,
  CONTRACT_BALANCE,
  THIS_ADDRESS,
  WRAPPED_CHAIN_TOKEN_SYMBOLS,
} from '@/const'
import { SwapCommands } from '@/enums'
import type { ExecuteArgs, MultiplePaymentOpts } from '@/types'

import { buildPayload } from './payload-builder'

type CommandPayload = {
  command: SwapCommands
  skipRevert: boolean
  data: string
}

export const getExecuteData = (
  args: ExecuteArgs | ExecuteArgs[],
  multiplePaymentOpts?: MultiplePaymentOpts,
): string => {
  return isArray(args)
    ? getExecuteDataMultiple(args, multiplePaymentOpts!)
    : getExecuteDataSingle(args)
}

const getExecuteDataMultiple = (
  args: ExecuteArgs[],
  multiplePaymentOpts: MultiplePaymentOpts,
): string => {
  const arg = args[0]
  const { amountOut, to } = multiplePaymentOpts
  const isBridgingRequired = getIsBridgingRequired(arg.from, arg.to)
  const isSameChainBundleExecution = Boolean(arg.bundle?.bundle)

  const data = [
    ...args.map(i => getSwapData(isBridgingRequired, i)).flat(),
    ...getBridgeData(isBridgingRequired, arg, to, amountOut),
    ...buildSameChainBundleData(isBridgingRequired, arg.bundle),
    ...buildTransferData(
      to,
      amountOut,
      arg.receiver || CALLER_ADDRESS,
      isBridgingRequired,
      isSameChainBundleExecution,
    ),
  ]

  return encodeCommandPayload(data)
}

const getExecuteDataSingle = (args: ExecuteArgs): string => {
  const { from, to, receiver = CALLER_ADDRESS } = args
  const { isUnwrapRequired, isWrapRequired } = getIsWrappedOrUnwrappedRequired(
    from,
    to,
  )
  const isWrappedOrUnwrapped = isWrapRequired || isUnwrapRequired
  const isBridgingRequired = getIsBridgingRequired(from, to)
  const isSameChainBundleExecution = Boolean(args.bundle?.bundle)

  // If token was wrapped\unwrapped thus amount for bridging equals to amountIn
  // and amountOut could be undefined otherwise if token was swapped we need
  // to take amountOut as amount for bridging\transferring
  const amount = isWrappedOrUnwrapped ? args.amountIn : args.amountOut!

  const data = [
    ...getSwapData(isBridgingRequired, args),
    ...getBridgeData(isBridgingRequired, args, args.to, amount),
    ...buildSameChainBundleData(isBridgingRequired, args.bundle),
    ...buildTransferData(
      to,
      amount,
      receiver,
      isBridgingRequired,
      isSameChainBundleExecution,
    ),
  ]
  return encodeCommandPayload(data)
}

const getSwapData = (
  isBridgingRequired: boolean,
  args: ExecuteArgs,
): CommandPayload[] => {
  const { from, to, amountIn, amountOut, receiver = CALLER_ADDRESS } = args

  const data = []

  const isSameChainBundleExecution = Boolean(args.bundle?.bundle)

  const { isUnwrapRequired, isWrapRequired } = getIsWrappedOrUnwrappedRequired(
    from,
    to,
  )
  const isWrappedOrUnwrapped = isWrapRequired || isUnwrapRequired

  // If bridging is required or if there is same chain bundle execution,
  // tokens must be on the swap contract balance.
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
  // add swap data such as: native -> erc20 | erc20 -> native | erc20 -> erc20

  if (!isWrappedOrUnwrapped) {
    if (!args.path || !amountOut) {
      throw new TypeError('path, amountOut args are required for swap')
    }

    data.push(...buildSwapData(from, to, amountIn, amountOut, args.path))

    // If to.isNative swap output token we need to unwrap it for UniswapV3
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

const getBridgeData = (
  isBridgingRequired: boolean,
  args: ExecuteArgs,
  to: Token,
  amount: Amount,
): CommandPayload[] => {
  if (!isBridgingRequired) return []
  const { receiver = CALLER_ADDRESS } = args
  return buildBridgeData(args, to, receiver, amount)
}

const encodeCommandPayload = (data: CommandPayload[]): string => {
  return new utils.Interface(MASTER_ROUTER_ABI).encodeFunctionData('make', [
    data,
  ])
}

const buildSwapData = (
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
      ? SwapCommands.SwapTokensForExactTokensTj
      : SwapCommands.SwapTokensForExactTokensV2

    if (from.isNative) {
      command = from.isTraderJoe
        ? SwapCommands.SwapExactAvaxForTokens
        : SwapCommands.SwapExactEthForTokens
    }
    if (to.isNative) {
      command = from.isTraderJoe
        ? SwapCommands.SwapTokensForExactAvax
        : SwapCommands.SwapTokensForExactEth
    }

    data.push(buildPayload(command, swapValues))
  }

  if (from.isUniswapV3) {
    const command = from.isNative
      ? SwapCommands.ExactInput
      : SwapCommands.ExactOutput

    data.push(buildPayload(command, [from.isNative, ...swapValues]))
  }

  return data
}

const buildBridgeData = (
  args: ExecuteArgs,
  to: Token,
  receiver: string,
  amountOut: Amount,
): CommandPayload[] => {
  if (!args.chainTo || isUndefined(args.isWrapped)) {
    throw new TypeError('chainTo, isWrapped args are required for bridging')
  }

  const bundleTuple = [
    args.bundle?.salt || utils.hexlify(utils.randomBytes(BUNDLE_SALT_BYTES)),
    args.bundle?.bundle ?? '0x',
  ]

  return [
    buildPayload(
      to.isNative ? SwapCommands.BridgeNative : SwapCommands.BridgeErc20,
      [
        ...(to.isNative ? [] : [to.address]),
        amountOut.value,
        bundleTuple,
        args.chainTo.name,
        receiver ?? CALLER_ADDRESS,
        ...(to.isNative ? [] : [args.isWrapped]),
      ],
    ),
  ]
}

const buildTransferData = (
  to: Token,
  amount: Amount,
  receiver: string,
  isBridgingRequired: boolean,
  isSameChainBundleExecution: boolean,
): CommandPayload[] => {
  // If token wasn't bridged thus transfer to the receiver is required
  // otherwise we will transfer change after swap operation which should be 0
  // but better to be sure that all tokens was transferred to the receiver
  const command = to.isNative
    ? SwapCommands.TransferNative
    : SwapCommands.TransferErc20
  const token = to.isNative ? [] : [to.address]

  // First time we transfer required amount of the tokens to the receiver is bridging
  // not required second time to be sure that swap contract balance is empty we
  // transfer change to the caller
  return [
    ...(isBridgingRequired || isSameChainBundleExecution
      ? []
      : [buildPayload(command, [...token, receiver, amount.value])]),
    buildPayload(command, [...token, CALLER_ADDRESS, CONTRACT_BALANCE]),
  ]
}

const buildSameChainBundleData = (
  isBridgingRequired: boolean,
  { bundle } = {} as TransactionBundle,
): CommandPayload[] => {
  if (isBridgingRequired || !bundle) return []

  // If bridging is not required and bundle is provided, thus we need to execute
  // bundle on the same chain.
  // To execute transaction bundle on the same chain we need to use multicall
  return [
    {
      command: SwapCommands.Multicall,
      skipRevert: false,
      data: bundle,
    },
  ]
}

const getIsWrappedOrUnwrappedRequired = (from: Token, to: Token) => {
  const isWrapRequired =
    from.isNative &&
    toLowerCase(WRAPPED_CHAIN_TOKEN_SYMBOLS[Number(from.chain.id)]) ===
      toLowerCase(to.symbol)

  const isUnwrapRequired =
    toLowerCase(WRAPPED_CHAIN_TOKEN_SYMBOLS[Number(from.chain.id)]) ===
      toLowerCase(from.symbol) &&
    toLowerCase(to.symbol) === toLowerCase(to.chain.token.symbol)

  return { isWrapRequired, isUnwrapRequired }
}

const getIsBridgingRequired = (from: Token, to: Token) => {
  return Number(from.chain.id) !== Number(to.chain.id)
}

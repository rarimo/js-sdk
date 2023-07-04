import type { Token } from '@rarimo/bridge'
import {
  Amount,
  type BridgeChain,
  BUNDLE_SALT_BYTES,
  isOneElementArray,
  isUndefined,
  MASTER_ROUTER_ABI,
  toLowerCase,
  type TransactionBundle,
} from '@rarimo/shared'
import { utils } from 'ethers'

import {
  CALLER_ADDRESS,
  CONTRACT_BALANCE,
  THIS_ADDRESS,
  WRAPPED_CHAIN_TOKEN_SYMBOLS,
} from '@/const'
import { SwapCommands } from '@/enums'
import { SwapperMultiplePaymentOptsEmptyError } from '@/errors'
import type { ExecuteArgs, IntermediateTokenOpts, SwapOpts } from '@/types'

import { buildPayload } from './payload-builder'

type CommandPayload = {
  command: SwapCommands
  skipRevert: boolean
  data: string
}

export const getExecuteData = (args: ExecuteArgs): string => {
  return isOneElementArray(args.swapOpts)
    ? getExecuteDataSingle(args)
    : getExecuteDataMultiple(args)
}

const getExecuteDataMultiple = (args: ExecuteArgs): string => {
  if (!args.multiplePaymentsOpts) {
    throw new SwapperMultiplePaymentOptsEmptyError()
  }

  const { amountOut, to } = args.multiplePaymentsOpts || {}
  const isBridgingRequired = getIsBridgingRequired(args.chainFrom, args.chainTo)

  const data = [
    ...args.swapOpts
      .map(i => getSwapData(isBridgingRequired, i, args.receiver, args.bundle))
      .flat(),
    ...buildBridgeData(
      isBridgingRequired,
      args.intermediateOpts!,
      args.chainTo,
      to,
      amountOut,
      args.receiver,
      args.bundle,
      args.isWrapped,
    ),
    ...getSameChainBundleData(isBridgingRequired, args.bundle),
    ...buildTransferData(to),
  ]

  return encodeCommandPayload(data)
}

const getExecuteDataSingle = (args: ExecuteArgs): string => {
  const {
    chainFrom,
    chainTo,
    bundle,
    isWrapped,
    receiver = CALLER_ADDRESS,
  } = args
  const { from, to, amountIn, amountOut } = args.swapOpts[0]
  const { isUnwrapRequired, isWrapRequired } = getIsWrappedOrUnwrappedRequired(
    from,
    to,
  )
  const isWrappedOrUnwrapped = isWrapRequired || isUnwrapRequired
  const isBridgingRequired = getIsBridgingRequired(chainFrom, chainTo)

  // If token was wrapped\unwrapped thus amount for bridging equals to amountIn
  // and amountOut could be undefined otherwise if token was swapped, we need
  // to take amountOut as amount for bridging\transferring
  const amount = isWrappedOrUnwrapped ? amountIn : amountOut

  return encodeCommandPayload([
    ...getSwapData(isBridgingRequired, args.swapOpts[0], receiver, args.bundle),
    ...buildBridgeData(
      isBridgingRequired,
      args.intermediateOpts!,
      chainTo,
      to,
      amount,
      receiver,
      bundle,
      isWrapped,
    ),
    ...getSameChainBundleData(isBridgingRequired, args.bundle),
    ...buildTransferData(to),
  ])
}

const getSwapData = (
  isBridgingRequired: boolean,
  args: SwapOpts,
  receiver = CALLER_ADDRESS,
  bundle?: TransactionBundle,
): CommandPayload[] => {
  const { from, to, amountIn, amountOut } = args

  const data = []

  const isSameChainBundleExecution = Boolean(bundle?.bundle)

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

const buildIntermediateBundleData = (
  opts: IntermediateTokenOpts,
  chainTo: BridgeChain,
  bundle?: TransactionBundle,
): string => {
  const { from, to, amountIn, amountOut, path } = opts

  const encodedFunctionData = encodeCommandPayload([
    buildPayload(SwapCommands.TransferErc20, [
      from.address,
      chainTo.contractAddress,
      amountIn.value,
    ]),
    ...buildSwapData(from, to, amountIn, amountOut, path!),
    ...buildSameChainBundleData(bundle),
    ...buildTransferData(to),
  ])

  return utils.defaultAbiCoder.encode(
    ['address[]', 'uint256[]', 'bytes[]'],
    [
      [chainTo.contractAddress],
      // the amount will always be 0, because the intermediate token is not native
      ['0'],
      [encodedFunctionData],
    ],
  )
}

const buildBridgeData = (
  isBridgingRequired: boolean,
  intermediateOpts: IntermediateTokenOpts,
  chainTo: BridgeChain,
  to: Token,
  amountOut: Amount,
  receiver: string = CALLER_ADDRESS,
  bundle?: TransactionBundle,
  isWrapped?: boolean,
): CommandPayload[] => {
  if (!isBridgingRequired) return []

  if (isUndefined(isWrapped) || !intermediateOpts) {
    throw new TypeError(
      'isWrapped, intermediateOpts arguments are required for bridging',
    )
  }

  const bundleTuple = [
    bundle?.salt || utils.hexlify(utils.randomBytes(BUNDLE_SALT_BYTES)),
    buildIntermediateBundleData(intermediateOpts, chainTo, bundle),
  ]

  return [
    buildPayload(
      to.isNative ? SwapCommands.BridgeNative : SwapCommands.BridgeErc20,
      [
        ...(to.isNative ? [] : [to.address]),
        amountOut.value,
        bundleTuple,
        chainTo.name,
        receiver,
        ...(to.isNative ? [] : [isWrapped]),
      ],
    ),
  ]
}

const buildTransferData = (to: Token): CommandPayload[] => {
  // If the token wasn't bridged thus transfer to the receiver is required,
  // otherwise we will transfer change after swap operation which should be 0
  // but better to be sure that all tokens were transferred to the receiver
  const command = to.isNative
    ? SwapCommands.TransferNative
    : SwapCommands.TransferErc20
  const token = to.isNative ? [] : [to.address]

  // We transfer amount of the tokens that left on the swap-contract balance
  // to the receiver to be sure that the contract balance is empty
  return [buildPayload(command, [...token, CALLER_ADDRESS, CONTRACT_BALANCE])]
}

const getSameChainBundleData = (
  isBridgingRequired: boolean,
  bundle?: TransactionBundle,
): CommandPayload[] => {
  if (isBridgingRequired) return []
  return buildSameChainBundleData(bundle)
}

const buildSameChainBundleData = (
  { bundle } = {} as TransactionBundle,
): CommandPayload[] => {
  if (!bundle) return []
  // If bridging is not required and a bundle is provided, thus we need to execute
  // a bundle on the same chain. To execute the transaction bundle on the same
  // chain, we need to use multicall
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

const getIsBridgingRequired = (
  chainFrom: BridgeChain,
  chainTo: BridgeChain,
) => {
  return Number(chainFrom.id) !== Number(chainTo.id)
}

const encodeCommandPayload = (data: CommandPayload[]): string => {
  return new utils.Interface(MASTER_ROUTER_ABI).encodeFunctionData('make', [
    data,
  ])
}

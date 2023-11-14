import { isOneElementArray } from '@rarimo/shared'

import { SwapperMultiplePaymentOptsEmptyError } from '@/errors'
import type { ExecuteArgs } from '@/types'

import { getBridgeData } from './bridge'
import {
  encodeCommandPayload,
  getIsBridgingRequired,
  getIsWrappedOrUnwrappedRequired,
} from './helpers'
import { getSameChainBundleData } from './same-chain'
import { getSwapData } from './swap'
import { getTransferData } from './transfer'

export const getExecuteData = (args: ExecuteArgs): string => {
  return isOneElementArray(args.swapOpts)
    ? getExecuteDataSingle(args)
    : getExecuteDataMultiple(args)
}

const getExecuteDataMultiple = ({
  swapOpts,
  intermediateOpts,
  chainTo,
  chainFrom,
  receiver,
  bundle,
  isWrapped,
  multiplePaymentsOpts,
}: ExecuteArgs): string => {
  if (!multiplePaymentsOpts) throw new SwapperMultiplePaymentOptsEmptyError()

  const { amountOut, to } = multiplePaymentsOpts || {}
  const isBridgingRequired = getIsBridgingRequired(chainFrom, chainTo)

  const data = [
    ...swapOpts
      .map(i => getSwapData(isBridgingRequired, i, receiver, bundle))
      .flat(),
    ...getBridgeData(
      isBridgingRequired,
      intermediateOpts!,
      chainTo,
      to,
      amountOut,
      receiver!,
      bundle,
      isWrapped,
    ),
    ...getSameChainBundleData(isBridgingRequired, bundle),
    ...swapOpts.map(i => getTransferData(i.from, receiver)).flat(),
    ...getTransferData(to, receiver),
  ]

  return encodeCommandPayload(data)
}

const getExecuteDataSingle = ({
  swapOpts,
  chainFrom,
  chainTo,
  bundle,
  intermediateOpts,
  isWrapped,
  receiver,
}: ExecuteArgs): string => {
  // for the case of single execute, there will be only one item in the array
  const swapArgs = swapOpts[0]

  const { from, to, amountIn, amountOut } = swapArgs
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
    ...getSwapData(isBridgingRequired, swapOpts[0], receiver, bundle),
    ...getBridgeData(
      isBridgingRequired,
      intermediateOpts!,
      chainTo,
      to,
      amount,
      receiver!,
      bundle,
      isWrapped,
    ),
    ...getSameChainBundleData(isBridgingRequired, bundle),
    ...getTransferData(from, receiver),
    ...getTransferData(to, receiver),
  ])
}

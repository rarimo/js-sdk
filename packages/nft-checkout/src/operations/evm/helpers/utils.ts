import { BN } from '@distributedlab/tools'
import {
  Amount,
  NATIVE_TOKEN_WRAP_SLIPPAGE_MULTIPLIER,
  Price,
  RARIMO_BRIDGE_FEE,
} from '@rarimo/shared'

import type { CheckoutOperationParams } from '@/types'

const ONE = 1
const ONE_HUNDRED = 100

export const getSwapAmount = (
  params: CheckoutOperationParams,
  amountOut?: Amount,
): Amount => {
  const rawPrice = amountOut || params.price
  // If amountOut is provided, it means that we are doing multiple token payment
  // thus target amount is already calculated
  if (amountOut || isSameChainOperation(params)) return rawPrice

  const decimals = rawPrice.decimals
  const numerator = BN.fromBigInt(rawPrice.value, decimals)

  const percentBN = BN.fromRaw(RARIMO_BRIDGE_FEE, decimals).div(
    BN.fromRaw(ONE_HUNDRED, decimals),
  )

  const denominator = BN.fromRaw(ONE, decimals).sub(percentBN)

  return Amount.fromBigInt(numerator.div(denominator).value, rawPrice.decimals)
}

export const getNativeAmountIn = (
  params: CheckoutOperationParams,
  rawPrice: Price | Amount,
): Amount => {
  if (isSameChainOperation(params)) return rawPrice

  const amountWithSlippage = BN.fromBigInt(
    rawPrice.value,
    rawPrice.decimals,
  ).mul(BN.fromRaw(NATIVE_TOKEN_WRAP_SLIPPAGE_MULTIPLIER, rawPrice.decimals))

  return Amount.fromBigInt(amountWithSlippage.value, rawPrice.decimals)
}

export const isSameChainOperation = (params: CheckoutOperationParams) => {
  return Number(params.chainIdFrom) === Number(params.chainIdTo)
}

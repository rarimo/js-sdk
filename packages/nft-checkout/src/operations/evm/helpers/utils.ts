import { BN } from '@distributedlab/tools'
import { Amount, RARIMO_BRIDGE_FEE } from '@rarimo/shared'

import { Price } from '@/entities'
import type { CheckoutOperationParams, PaymentToken } from '@/types'

const ONE = 1
const ONE_HUNDRED = 100

export const getSwapAmountOutWithBridgeFee = (
  price: Price | Amount,
): Amount => {
  const decimals = price.decimals
  const numerator = BN.fromBigInt(price.value, decimals)

  const percentBN = BN.fromRaw(RARIMO_BRIDGE_FEE, decimals).div(
    BN.fromRaw(ONE_HUNDRED, decimals),
  )

  const denominator = BN.fromRaw(ONE, decimals).sub(percentBN)

  return Amount.fromBigInt(numerator.div(denominator).value, price.decimals)
}

export const isSameChainOperation = (params: CheckoutOperationParams) => {
  return Number(params.chainIdFrom) === Number(params.chainIdTo)
}

export const bnFromAmountLike = (amount: Amount): BN => {
  return BN.fromBigInt(amount.value, amount.decimals)
}

export const priceFromPaymentToken = (token: PaymentToken): Price => {
  return Price.fromBigInt(
    token.balanceRaw.value,
    token.balanceRaw.decimals,
    token.symbol,
  )
}

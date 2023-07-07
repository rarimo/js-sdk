import { BN } from '@distributedlab/tools'
import { Amount, RARIMO_BRIDGE_FEE } from '@rarimo/shared'

import { Price } from '@/entities'
import type { CheckoutOperationParams } from '@/types'

const ONE = 1
const ONE_HUNDRED = 100
const WEI = 18

const isAmountLike = (amount: unknown): amount is Amount | Price => {
  return amount instanceof Amount || amount instanceof Price
}

export const getAmountWithBridgeFee = (amount: Price | Amount | BN): Amount => {
  const decimals = amount.decimals
  const numerator = bnFromAmountLike(amount)

  const percentBN = BN.fromRaw(RARIMO_BRIDGE_FEE, decimals).div(
    BN.fromRaw(ONE_HUNDRED, decimals),
  )

  const denominator = BN.fromRaw(ONE, decimals).sub(percentBN)
  return Amount.fromBN(numerator.div(denominator))
}

export const getAmountWithoutBridgeFee = (
  amount: Price | Amount | BN,
): Amount => {
  const _amount = bnFromAmountLike(amount)
  const numerator = _amount.mul(BN.fromRaw(ONE, WEI))
  const oneHundred = BN.fromRaw(ONE_HUNDRED, WEI)
  const denominator = oneHundred.add(BN.fromRaw(RARIMO_BRIDGE_FEE, WEI))

  return Amount.fromBN(
    numerator.div(denominator).mul(oneHundred).toDecimals(_amount.decimals),
  )
}

export const isSameChainOperation = (params: CheckoutOperationParams) => {
  return Number(params.chainIdFrom) === Number(params.chainIdTo)
}

export const bnFromAmountLike = (amount: Amount | BN): BN => {
  return isAmountLike(amount)
    ? BN.fromBigInt(amount.value, amount.decimals)
    : amount
}

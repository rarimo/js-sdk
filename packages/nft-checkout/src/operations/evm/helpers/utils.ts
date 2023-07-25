import { BN } from '@distributedlab/tools'
import { Amount } from '@rarimo/shared'

import { Price } from '@/entities'
import type { CheckoutOperationParams } from '@/types'

const isAmountLike = (amount: unknown): amount is Amount | Price => {
  return amount instanceof Amount || amount instanceof Price
}

export const isSameChainOperation = (params: CheckoutOperationParams) => {
  return Number(params.chainIdFrom) === Number(params.chainIdTo)
}

export const bnFromAmountLike = (amount: Amount | BN): BN => {
  return isAmountLike(amount)
    ? BN.fromBigInt(amount.value, amount.decimals)
    : amount
}

import { BN } from '@distributedlab/tools'
import type { Token } from '@rarimo/bridge'
import { Amount, type ChainId } from '@rarimo/shared'

import { errors } from '@/errors'
import type { PaymentToken, SwapEstimation } from '@/types'

import { getEstimation } from './get-estimation'
import { bnFromAmountLike, priceFromPaymentToken } from './utils'

export const estimate = async ({
  chainIdFrom,
  chainIdTo,
  from,
  to,
  isMultiplePayment,
  slippage,
  amountOut,
}: {
  chainIdFrom: ChainId
  chainIdTo: ChainId
  from: PaymentToken[]
  to: Token
  isMultiplePayment: boolean
  slippage?: number
  amountOut: Amount
}) => {
  const _estimatePriceSingle = (from: PaymentToken, _amountOut?: Amount) => {
    return getEstimation({
      chainIdFrom,
      chainIdTo,
      from,
      to,
      amountOut: _amountOut || amountOut,
      slippage,
    })
  }

  const _estimatePriceMultiple = async (from: PaymentToken[]) => {
    const estimations: SwapEstimation[] = []
    const totalAmountOut = BN.fromRaw('0', to.decimals)
    const targetAmountOut = bnFromAmountLike(amountOut)

    for (const token of from) {
      const _amountOut = targetAmountOut.clone().sub(totalAmountOut)

      const estimation = await _estimatePriceSingle(
        token,
        Amount.fromBN(_amountOut),
      )

      // If the estimated price of the swap is less or equal than balance,
      // we can use it, otherwise, we need to use balance as amount in
      const isPriceLessThanOrEqualToBalance =
        estimation.amountOut.isLessThanOrEqualTo(token.balanceRaw)

      const estimationToAdd = isPriceLessThanOrEqualToBalance
        ? estimation
        : {
            ...estimation,
            price: priceFromPaymentToken(token),
          }

      const amountToAdd = isPriceLessThanOrEqualToBalance
        ? bnFromAmountLike(estimation.amountOut)
        : bnFromAmountLike(token.balanceRaw)

      estimations.push(estimationToAdd)
      totalAmountOut.add(amountToAdd)

      if (totalAmountOut.isEqualTo(targetAmountOut)) {
        return estimations
      }
    }

    throw new errors.OperationInsufficientFundsError()
  }

  if (!from.length) throw new errors.OperationPaymentTokensNotProvidedError()

  return isMultiplePayment
    ? _estimatePriceMultiple(from)
    : [await _estimatePriceSingle(from[0])]
}

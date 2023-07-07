import { BN } from '@distributedlab/tools'
import type { Token } from '@rarimo/bridge'
import { Amount, type ChainId } from '@rarimo/shared'

import { errors } from '@/errors'
import type { PaymentToken, SwapEstimation } from '@/types'

import { getEstimation } from './get-estimation'
import { bnFromAmountLike } from './utils'

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
  const _estimatePriceSingle = ({
    from,
    amountIn,
    amountOut: _amountOut,
  }: {
    from: PaymentToken
    amountOut?: Amount
    amountIn?: Amount
  }) => {
    return getEstimation({
      chainIdFrom,
      chainIdTo,
      from,
      to,
      ...(amountIn ? { amountIn } : { amountOut: _amountOut || amountOut }),
      slippage,
    })
  }

  const _estimatePriceMultiple = async (from: PaymentToken[]) => {
    const estimations: SwapEstimation[] = [] // usdc
    let totalAmountOut = BN.fromRaw('0', to.decimals)
    const targetAmountOut = bnFromAmountLike(amountOut)
    const zero = BN.fromRaw('0', to.decimals)

    for (const token of from) {
      let amountOut = targetAmountOut.sub(totalAmountOut)

      if (amountOut.isLessThan(zero)) {
        amountOut = totalAmountOut.add(amountOut)
      }

      let estimation = await _estimatePriceSingle({
        from: token,
        amountOut: Amount.fromBN(amountOut),
      })

      const isAmountInGreaterThanBalance = estimation.amountIn.isGreaterThan(
        token.balanceRaw,
      )

      if (isAmountInGreaterThanBalance) {
        estimation = await _estimatePriceSingle({
          from: token,
          amountIn: token.balanceRaw,
        })
      }

      estimations.push(estimation)
      totalAmountOut = totalAmountOut.add(
        bnFromAmountLike(estimation.amountOut),
      )

      if (totalAmountOut.isEqualTo(targetAmountOut)) return estimations
    }

    throw new errors.OperationInsufficientFundsError()
  }

  if (!from.length) throw new errors.OperationPaymentTokensNotProvidedError()

  return isMultiplePayment
    ? _estimatePriceMultiple(from)
    : [await _estimatePriceSingle({ from: from[0] })]
}

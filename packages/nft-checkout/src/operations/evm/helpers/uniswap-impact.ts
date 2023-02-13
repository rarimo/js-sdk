import { Fraction, Percent, Currency, TradeType } from '@uniswap/sdk-core'
import { Pair } from '@uniswap/v2-sdk'
import { FeeAmount, Pool } from '@uniswap/v3-sdk'
import { Trade } from '@uniswap/router-sdk'

export class InterfaceTrade extends Trade<Currency, Currency, TradeType> {}

const ZERO_PERCENT = new Percent('0')
const ONE_HUNDRED_PERCENT = new Percent('1')

export const getFeeAmount = (pool: Pair | Pool): FeeAmount => {
  // Pair's (ie V2) FeeAmounts are always equivalent to FeeAmount.MEDIUM: 30 bips.
  if (pool instanceof Pair) return FeeAmount.MEDIUM
  return pool.fee
}

export const computeRealizedPriceImpact = (trade: InterfaceTrade): Percent => {
  const realizedLpFeePercent = computeRealizedLPFeePercent(trade)
  return trade.priceImpact.subtract(realizedLpFeePercent)
}

// computes realized lp fee as a percent
const computeRealizedLPFeePercent = (trade: InterfaceTrade): Percent => {
  let percent: Percent

  percent = ZERO_PERCENT
  for (const swap of trade.swaps) {
    const { numerator, denominator } = swap.inputAmount.divide(
      trade.inputAmount,
    )
    const overallPercent = new Percent(numerator, denominator)

    const routeRealizedLPFeePercent = overallPercent.multiply(
      ONE_HUNDRED_PERCENT.subtract(
        swap.route.pools.reduce<Percent>(
          (currentFee: Percent, pool: Pair | Pool): Percent => {
            const fee = getFeeAmount(pool)
            return currentFee.multiply(
              ONE_HUNDRED_PERCENT.subtract(new Fraction(fee, 1_000_000)),
            )
          },
          ONE_HUNDRED_PERCENT,
        ),
      ),
    )

    percent = percent.add(routeRealizedLPFeePercent)
  }

  return new Percent(percent.numerator, percent.denominator)
}

import { Trade } from '@uniswap/router-sdk'
import { Currency, Fraction, Percent, TradeType } from '@uniswap/sdk-core'
import { Pair } from '@uniswap/v2-sdk'
import { FeeAmount, Pool } from '@uniswap/v3-sdk'

export class InterfaceTrade extends Trade<Currency, Currency, TradeType> {}

const ONE_HUNDRED_PERCENT = new Percent('1')

export const getFeeAmount = (pool: Pair | Pool): FeeAmount => {
  // Pair's (ie V2) FeeAmounts are always equivalent to FeeAmount.MEDIUM: 30 bips.
  if (pool instanceof Pair) return FeeAmount.MEDIUM
  return pool.fee
}

export const computeRealizedPriceImpact = (trade: InterfaceTrade): string => {
  const realizedLpFeePercent = computeRealizedLPFeePercent(trade)
  return trade.priceImpact
    .subtract(realizedLpFeePercent)
    .multiply(-1)
    .toSignificant(3)
}

const computeRealizedLPFeePercent = (trade: InterfaceTrade): Percent => {
  const percent = trade.swaps.reduce((perc, swap) => {
    const { numerator, denominator } = swap.inputAmount.divide(
      trade.inputAmount,
    )

    const routeRealizedLPFeePercent = getRouteRealizedLPFeePercent(
      new Percent(numerator, denominator),
      swap.route.pools,
    )

    perc = perc.add(routeRealizedLPFeePercent)

    return perc
  }, new Percent('0'))

  return new Percent(percent.numerator, percent.denominator)
}

const getRouteRealizedLPFeePercent = (
  overallPercent: Percent,
  pools: Array<Pool | Pair>,
) => {
  const a = pools.reduce((currentFee, pool) => {
    const fee = getFeeAmount(pool)

    return currentFee.multiply(
      ONE_HUNDRED_PERCENT.subtract(new Fraction(fee, 1_000_000)),
    )
  }, ONE_HUNDRED_PERCENT)

  return overallPercent.multiply(ONE_HUNDRED_PERCENT.subtract(a))
}

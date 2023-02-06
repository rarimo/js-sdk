import { Percent } from '@uniswap/sdk-core'

import { computeRealizedPriceImpact, getPriceImpactWarning } from '@/helpers'
import { InterfaceTrade } from '@/types'

export function usePriceImpact(trade: InterfaceTrade | undefined) {
  const marketPriceImpact = trade
    ? computeRealizedPriceImpact(trade)
    : undefined
  if (!marketPriceImpact) {
    return undefined
  }

  const percent = marketPriceImpact
  return percent
    ? {
        percent,
        warning: getPriceImpactWarning(percent),
        toString: () => toHumanReadablePercent(percent),
      }
    : undefined
}

export function toHumanReadablePercent(priceImpact: Percent): string {
  const sign = priceImpact.lessThan(0) ? '+' : ''
  const number = parseFloat(priceImpact.multiply(-1)?.toSignificant(3))
  return `${sign}${number}%`
}

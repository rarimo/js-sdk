import { Currency, CurrencyAmount, Fraction, Price } from '@uniswap/sdk-core'
import JSBI from 'jsbi'

import { DEFAULT_LOCALE } from '@/const'

interface FormatLocaleNumberArgs {
  number: CurrencyAmount<Currency> | Price<Currency, Currency> | number
  locale: string | null | undefined
  options?: Intl.NumberFormatOptions
  sigFigs?: number
  fixedDecimals?: number
}

export default function formatLocaleNumber({
  number,
  sigFigs,
  fixedDecimals,
  options = {},
}: FormatLocaleNumberArgs): string {
  const localeArg = DEFAULT_LOCALE
  options.minimumFractionDigits = options.minimumFractionDigits || fixedDecimals
  options.maximumFractionDigits = options.maximumFractionDigits || fixedDecimals

  // Fixed decimals should override significant figures.
  options.maximumSignificantDigits =
    options.maximumSignificantDigits || fixedDecimals ? undefined : sigFigs

  let numberString: number
  if (typeof number === 'number') {
    numberString = fixedDecimals
      ? parseFloat(number.toFixed(fixedDecimals))
      : number
  } else {
    const baseString = parseFloat(number.toSignificant(sigFigs))
    numberString = fixedDecimals
      ? parseFloat(baseString.toFixed(fixedDecimals))
      : baseString
  }

  return numberString.toLocaleString(localeArg, options)
}

export function formatCurrencyAmount(
  amount: CurrencyAmount<Currency> | undefined,
  sigFigs: number,
  locale: string,
  fixedDecimals?: number,
): string {
  if (!amount) {
    return '-'
  }

  if (JSBI.equal(amount.quotient, JSBI.BigInt(0))) {
    return '0'
  }
  const isTinyNumber = amount
    .divide(amount.decimalScale)
    .lessThan(new Fraction(1, 100000))

  const localeNumber = formatLocaleNumber({
    number: isTinyNumber ? 0.00001 : amount,
    locale,
    sigFigs,
    fixedDecimals,
  })

  return `${isTinyNumber ? '<' : ''}${localeNumber}`
}

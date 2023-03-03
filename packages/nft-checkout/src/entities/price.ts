import { BN } from '@distributedlab/utils'

import { Decimals, TokenSymbol } from '@/types'

import { AmountBase } from './amount'

export class Price extends AmountBase {
  readonly #symbol: TokenSymbol

  protected constructor(value: string, decimals: Decimals, symbol: string) {
    super(value, decimals)
    this.#symbol = symbol
  }

  get symbol(): string {
    return this.#symbol
  }

  static fromRaw(value: string, decimals: number, symbol: string): Price {
    return new Price(
      new BN(value).toFraction(decimals).toString(),
      decimals,
      symbol,
    )
  }

  static fromFraction(value: string, decimals: number, symbol: string): Price {
    return new Price(value, decimals, symbol)
  }
}

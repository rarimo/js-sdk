import { BN } from '@distributedlab/tools'

import { Decimals, TokenSymbol } from '@/types'

import { AmountBase } from './amount'

export class Price extends AmountBase {
  readonly #symbol: TokenSymbol

  protected constructor(value: BN, symbol: string) {
    super(value)
    this.#symbol = symbol
  }

  get symbol(): string {
    return this.#symbol
  }

  static fromRaw(value: string, decimals: Decimals, symbol: string): Price {
    return new Price(BN.fromRaw(value, decimals), symbol)
  }

  static fromBigInt(value: string, decimals: Decimals, symbol: string): Price {
    return new Price(BN.fromBigInt(value, decimals), symbol)
  }
}

import { BN } from '@distributedlab/tools'
import type { Decimals, TokenSymbol } from '@rarimo/core'
import { AmountBase } from '@rarimo/core'

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

import { BN } from '@distributedlab/tools'
import type {
  ClassInstanceToPlainObject,
  Decimals,
  HexString,
  TokenSymbol,
} from '@rarimo/shared'
import { AmountBase } from '@rarimo/shared'

export class Price extends AmountBase {
  readonly #symbol: TokenSymbol
  readonly #address?: HexString

  protected constructor(value: BN, symbol: string, address?: HexString) {
    super(value)
    this.#symbol = symbol
    this.#address = address
  }

  get symbol(): string {
    return this.#symbol
  }

  get address(): HexString | undefined {
    return this.#address
  }

  public static fromRaw(
    value: string,
    decimals: Decimals,
    symbol: TokenSymbol,
    address?: HexString,
  ): Price {
    return new Price(BN.fromRaw(value, decimals), symbol, address)
  }

  public static fromBigInt(
    value: string,
    decimals: Decimals,
    symbol: TokenSymbol,
    address?: HexString,
  ): Price {
    return new Price(BN.fromBigInt(value, decimals), symbol, address)
  }

  public static fromPlainObject(
    price: ClassInstanceToPlainObject<Price>,
  ): Price {
    return new Price(
      BN.fromBigInt(price.value, price.decimals),
      price.symbol,
      price.address,
    )
  }

  public toJSON() {
    return {
      value: this.value,
      decimals: this.decimals,
      symbol: this.symbol,
      address: this.address,
    }
  }
}

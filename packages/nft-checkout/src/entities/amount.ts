import { BN } from '@distributedlab/utils'

export class AmountBase {
  readonly #value: string
  readonly #decimals: number

  protected constructor(value: string, decimals: number) {
    this.#value = value
    this.#decimals = decimals
  }

  get value(): string {
    return this.#value
  }

  get decimals(): number {
    return this.#decimals
  }

  toString(): string {
    return new BN(this.#value).fromFraction(this.#decimals).toString()
  }
}

export class Amount extends AmountBase {
  protected constructor(value: string, decimals: number) {
    super(value, decimals)
  }

  static fromFraction(value: string, decimals: number): Amount {
    return new Amount(value, decimals)
  }

  static fromRaw(value: string, decimals: number): Amount {
    return new Amount(new BN(value).toFraction(decimals).toString(), decimals)
  }
}

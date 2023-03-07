import { BN } from '@distributedlab/tools'

import { Decimals } from '@/types'

export class AmountBase {
  readonly #value: BN
  readonly #decimals: Decimals

  protected constructor(value: BN) {
    this.#value = value
    this.#decimals = value.cfg.decimals
  }

  get value(): string {
    return this.#value.valueOf()
  }

  get decimals(): Decimals {
    return this.#decimals
  }

  toString(): string {
    return this.#value.fromFraction(this.#decimals).toString()
  }
}

export class Amount extends AmountBase {
  protected constructor(value: BN) {
    super(value)
  }

  static fromBigInt(value: string, decimals: Decimals): Amount {
    return new Amount(BN.fromBigInt(value, decimals))
  }

  static fromRaw(value: string, decimals: Decimals): Amount {
    return new Amount(BN.fromRaw(value, decimals))
  }
}

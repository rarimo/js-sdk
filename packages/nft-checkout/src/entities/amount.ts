import { BN } from '@distributedlab/tools'

import type { Decimals } from '@/types'

export class AmountBase {
  readonly #bn: BN

  protected constructor(value: BN) {
    this.#bn = value
  }

  get value(): string {
    return this.#bn.value
  }

  get decimals(): Decimals {
    return this.#bn.decimals
  }

  toString(): string {
    return this.#bn.toString()
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

import { BN } from '@distributedlab/tools'

import type { ClassInstanceToPlainObject, Decimals } from '@/types'

export class AmountBase {
  readonly #bn: BN

  protected constructor(value: BN) {
    this.#bn = value
  }

  public get bn(): BN {
    return this.#bn
  }

  public get value(): string {
    return this.#bn.value
  }

  public get decimals(): Decimals {
    return this.#bn.decimals
  }

  public get isZero(): boolean {
    return this.#bn.isZero
  }

  public isLessThan(amount: AmountBase): boolean {
    return this.#bn.lt(amount.bn)
  }

  public isLessThanOrEqualTo(amount: AmountBase): boolean {
    return this.#bn.lte(amount.bn)
  }

  public isGreaterThan(amount: AmountBase): boolean {
    return this.#bn.gt(amount.bn)
  }

  public isGreaterThanOrEqualTo(amount: AmountBase): boolean {
    return this.#bn.gte(amount.bn)
  }

  public toString(): string {
    return this.#bn.toString()
  }

  public toJSON() {
    return {
      value: this.value,
      decimals: this.decimals,
    }
  }
}

export class Amount extends AmountBase {
  protected constructor(value: BN) {
    super(value)
  }

  public static fromBigInt(value: string, decimals: Decimals): Amount {
    return new Amount(BN.fromBigInt(value, decimals))
  }

  public static fromRaw(value: string, decimals: Decimals): Amount {
    return new Amount(BN.fromRaw(value, decimals))
  }

  public static fromBN(value: BN): Amount {
    return new Amount(value)
  }

  public static fromPlainObject(
    amount: ClassInstanceToPlainObject<Amount>,
  ): Amount {
    return new Amount(BN.fromBigInt(amount.value, amount.decimals))
  }
}

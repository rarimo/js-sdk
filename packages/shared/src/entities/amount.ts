import { BN } from '@distributedlab/tools'

import type { Decimals } from '@/types'

export class AmountBase {
  readonly #bn: BN

  protected constructor(value: BN) {
    this.#bn = value
  }

  public get value(): string {
    return this.#bn.value
  }

  public get decimals(): Decimals {
    return this.#bn.decimals
  }

  public isLessThan(amount: AmountBase): boolean {
    return BN.fromBigInt(this.value, this.decimals).isLessThan(
      BN.fromBigInt(amount.value, amount.decimals),
    )
  }

  public isLessThanOrEqualTo(amount: AmountBase): boolean {
    return BN.fromBigInt(this.value, this.decimals).isLessThanOrEqualTo(
      BN.fromBigInt(amount.value, amount.decimals),
    )
  }

  public isGreaterThan(amount: AmountBase): boolean {
    return BN.fromBigInt(this.value, this.decimals).isGreaterThan(
      BN.fromBigInt(amount.value, amount.decimals),
    )
  }

  public isGreaterThanOrEqualTo(amount: AmountBase): boolean {
    return BN.fromBigInt(this.value, this.decimals).isGreaterThanOrEqualTo(
      BN.fromBigInt(amount.value, amount.decimals),
    )
  }

  public toString(): string {
    return this.#bn.toString()
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
}

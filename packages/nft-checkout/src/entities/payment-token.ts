import type { CreateTokenOpts } from '@/types'

import type { Amount } from './amount'
import { Token } from './token'

export class PaymentToken extends Token {
  readonly #balance: Amount

  constructor(token: CreateTokenOpts, balance: Amount) {
    super(token)
    this.#balance = balance
  }

  get balance(): string {
    return this.#balance.toString()
  }

  get balanceRaw(): Amount {
    return this.#balance
  }

  static fromToken(token: Token, balance: Amount): PaymentToken {
    return new PaymentToken(token, balance)
  }
}

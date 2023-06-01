import type { NewTokenOpts, Token } from '@rarimo/bridge'
import { newToken } from '@rarimo/bridge'
import type { Amount } from '@rarimo/shared'

import type { PaymentToken } from '@/types'

export const newPaymentToken = (
  pt: NewTokenOpts & { balance: Amount },
): PaymentToken => {
  const token = newToken(pt)
  return paymentTokenFromToken(token, pt.balance)
}

export const paymentTokenFromToken = (
  token: Token,
  balance: Amount,
): PaymentToken => ({
  ...token,
  balance: balance.toString(),
  balanceRaw: balance,
})

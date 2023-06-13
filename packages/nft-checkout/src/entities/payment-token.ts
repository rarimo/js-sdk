import type { Token } from '@rarimo/bridge'
import type { Amount } from '@rarimo/shared'

import type { PaymentToken } from '@/types'

export const paymentTokenFromToken = (
  token: Token,
  balance: Amount,
): PaymentToken => ({
  ...token,
  balance: balance.toString(),
  balanceRaw: balance,
})

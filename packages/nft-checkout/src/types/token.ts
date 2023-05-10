import type { Token } from '@rarimo/bridge'
import type { Amount } from '@rarimo/shared'

import type { Price } from '@/entities'

export type EstimatedPrice = {
  path?: string | string[]
  impact?: string
  gasPrice?: string
  gasPriceInUSD?: string
  from: Token
  to: Token
  price: Price
}

export type PaymentToken = Token & {
  balance: string
  balanceRaw: Amount
}

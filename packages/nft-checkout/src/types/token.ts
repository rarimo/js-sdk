import type { Token } from '@rarimo/bridge'
import type { Amount } from '@rarimo/shared'

import type { Price } from '@/entities'

export type EstimatedPrice = {
  from: Token
  to: Token
  price: Price
  amountOut?: Amount
  path?: string | string[]
  impact?: string
  gasPrice?: string
  gasPriceInUSD?: string
}

export type PaymentToken = Token & {
  balance: string
  balanceRaw: Amount
}

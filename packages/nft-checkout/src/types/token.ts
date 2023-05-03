import type { Address, BridgeChain, Decimals, TokenSymbol } from '@rarimo/core'

import type { Price, Token } from '@/entities'

export type EstimatedPrice = {
  path?: string | string[]
  impact?: string
  gasPrice?: string
  gasPriceInUSD?: string
  from: Token
  to: Token
  price: Price
}

export type CreateTokenOpts = {
  chain: BridgeChain
  address: Address
  name: string
  symbol: TokenSymbol
  decimals: Decimals
  logoURI?: string
}

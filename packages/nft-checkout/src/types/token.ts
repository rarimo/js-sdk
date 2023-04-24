import type { Price, Token } from '@/entities'

import type { Address, BridgeChain, Decimals, TokenSymbol } from './common'

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

import { Chain, ChainId } from '@rarimo/provider'
import { CONFIG } from '@/config'

export type Config = typeof CONFIG

export type Token = {
  chainId: number | string
  address: string
  name: string
  symbol: string
  decimals: number
  logoURI?: string
}

export type PaymentToken = {
  token: Token
  chain: Chain
  balance: string
}

export type Price = Amount & {
  symbol: string
}

export type Amount = {
  // UINT amount
  value: string
  decimals: number
}

export type EstimatedPrice = {
  impact?: string
  from: Token
  to: Token
  price: Price[]
}

export type BridgeChain = Chain & {
  contractAddress: string
}

export type Target = {
  chainId: ChainId
  address: string
  recipient: string
  price: Price
}

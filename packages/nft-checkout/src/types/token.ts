import { Address, BridgeChain, Decimals } from './common'
import { Amount, Price } from '@/entities'

export type Token = {
  chain: BridgeChain
  address: Address
  name: string
  symbol: string
  decimals: Decimals
  logoURI?: string
}

export type PaymentToken = {
  token: Token
  chain: BridgeChain
  balance: string
  balanceRaw: Amount
}

export type EstimatedPrice = {
  path?: string | string[]
  impact?: string
  gasPrice?: string
  gasPriceInUSD?: string
  from: Token
  to: Token
  price: Price
}

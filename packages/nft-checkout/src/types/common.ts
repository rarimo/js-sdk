import { Chain, ChainId } from '@rarimo/provider'

export type Config = {
  UNISWAP_TOKEN_LIST?: string
  TRADER_JOE_TOKEN_LIST?: string
  INFURA_KEY: string
  ROUTER_ADDRESS_UNISWAP?: string
  ROUTER_ADDRESS_AVAX?: string
}

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
  balanceRow: Amount
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
  gasPrice?: string
  gasPriceInUSD?: string
  from: Token
  to: Token
  price: Price
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

export type TxBundle = {
  bundle: string
  salt?: string
}

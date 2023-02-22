import { Chain, ChainId } from '@rarimo/provider'
import { SwapContractVersion } from '../enums'

export type Config = {
  V3_TOKEN_LIST?: string
  V2_TOKEN_LIST?: string
}

export type Token = {
  chain: BridgeChain
  address: string
  name: string
  symbol: string
  decimals: number
  logoURI?: string
}

export type PaymentToken = {
  token: Token
  chain: BridgeChain
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
  path?: string | string[]
  impact?: string
  gasPrice?: string
  gasPriceInUSD?: string
  from: Token
  to: Token
  price: Price
}

export type BridgeChain = Chain & {
  contractAddress: string
  contactVersion: SwapContractVersion
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

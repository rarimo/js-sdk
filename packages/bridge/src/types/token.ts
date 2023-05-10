import type {
  Address,
  BridgeChain,
  Decimals,
  TokenSymbol,
} from '@rarimo/shared'

export interface Token {
  chain: BridgeChain
  address: Address
  name: string
  symbol: TokenSymbol
  decimals: Decimals
  logoURI?: string

  isTraderJoe: boolean
  isQuickSwap: boolean
  isPancakeSwap: boolean
  isUniswapV3: boolean
  isV2: boolean

  isNative: boolean
}

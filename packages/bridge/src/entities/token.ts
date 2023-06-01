import type {
  Address,
  BridgeChain,
  Decimals,
  TokenSymbol,
} from '@rarimo/shared'
import { EVMDexType } from '@rarimo/shared'

import type { Token } from '@/types'

export type NewTokenOpts = {
  chain: BridgeChain
  address: Address
  name: string
  symbol: TokenSymbol
  decimals: Decimals
  logoURI?: string
}

export const newToken = (t: NewTokenOpts): Token => {
  const v = t.chain.dexType
  const raw = {
    isTraderJoe: v === EVMDexType.TraderJoe,
    isQuickSwap: v === EVMDexType.QuickSwap,
    isPancakeSwap: v === EVMDexType.PancakeSwap,
    isUniswapV3: v === EVMDexType.UniswapV3,
    isNative: t.chain.token.symbol.toLowerCase() === t.symbol.toLowerCase(),
  }

  return {
    ...raw,
    ...t,
    isUniswapV2: raw.isQuickSwap || raw.isPancakeSwap || raw.isTraderJoe,
  }
}

export const tokenFromChain = (chain: BridgeChain): Token => {
  return newToken({
    chain,
    address: '',
    name: chain.token.name,
    symbol: chain.token.symbol,
    decimals: chain.token.decimals,
    logoURI: chain.icon,
  })
}

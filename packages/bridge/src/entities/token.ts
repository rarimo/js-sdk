import {
  Address,
  BridgeChain,
  Decimals,
  EVMDexType,
  TokenSymbol,
} from '@rarimo/shared'

import type { Token } from '@/types'

export const newToken = (
  chain: BridgeChain,
  address: Address,
  name: string,
  symbol: TokenSymbol,
  decimals: Decimals,
  logoURI = '',
): Token => {
  const v = chain.dexType
  const raw = {
    isTraderJoe: v === EVMDexType.TraderJoe,
    isQuickSwap: v === EVMDexType.QuickSwap,
    isPancakeSwap: v === EVMDexType.PancakeSwap,
    isUniswapV3: v === EVMDexType.UniswapV3,
    isNative: chain.token.symbol.toLowerCase() === symbol.toLowerCase(),
  }

  return {
    ...raw,
    chain,
    address,
    name,
    symbol,
    decimals,
    logoURI,
    isUniswapV2: raw.isQuickSwap || raw.isPancakeSwap || raw.isTraderJoe,
  }
}

export const tokenFromChain = (chain: BridgeChain): Token => {
  return newToken(
    chain,
    '',
    chain.token.name,
    chain.token.symbol,
    chain.token.decimals,
    chain.icon,
  )
}

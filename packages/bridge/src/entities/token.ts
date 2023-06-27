import type {
  Address,
  BridgeChain,
  Decimals,
  InternalSupportedToken,
  TokenSymbol,
} from '@rarimo/shared'
import {
  EVMDexType,
  NATIVE_TOKEN_ADDRESS,
  RARIMO_IPFS_BASE_URL,
} from '@rarimo/shared'

import type { Token } from '@/types'

export type NewTokenOpts = {
  chain: BridgeChain
  address: Address
  name: string
  symbol: TokenSymbol
  decimals: Decimals
  logoURI?: string
  isNative?: boolean
}

export const newToken = (t: NewTokenOpts): Token => {
  const v = t.chain.dexType
  const raw = {
    isTraderJoe: v === EVMDexType.TraderJoe,
    isQuickSwap: v === EVMDexType.QuickSwap,
    isPancakeSwap: v === EVMDexType.PancakeSwap,
    isUniswapV3: v === EVMDexType.UniswapV3,
    isNative:
      t.isNative ??
      t.chain.token.symbol.toLowerCase() === t.symbol.toLowerCase(),
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
    isNative: true,
  })
}

export const tokenFromInternalSupportedToken = (
  token: InternalSupportedToken,
  chain: BridgeChain,
): Token => {
  const address = token.id

  const logoURI = token.logo_uri?.replace('ipfs://', RARIMO_IPFS_BASE_URL)

  return newToken({
    chain,
    address: address === NATIVE_TOKEN_ADDRESS ? '' : address,
    name: token.name,
    symbol: token.symbol,
    decimals: token.decimals,
    logoURI,
    isNative: Boolean(token.native),
  })
}

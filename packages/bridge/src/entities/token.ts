import {
  Address,
  BridgeChain,
  Decimals,
  EVMSwapContractVersion,
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
  const v = chain.contractVersion
  const raw = {
    isTraderJoe: v === EVMSwapContractVersion.TraderJoe,
    isQuickSwap: v === EVMSwapContractVersion.QuickSwap,
    isPancakeSwap: v === EVMSwapContractVersion.PancakeSwap,
    isUniswapV3: v === EVMSwapContractVersion.UniswapV3,
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
    isV2: raw.isQuickSwap || raw.isPancakeSwap || raw.isTraderJoe,
  }
}

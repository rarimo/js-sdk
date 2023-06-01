import { Fetcher } from '@distributedlab/fetcher'
import { newToken, Token, tokenFromChain } from '@rarimo/bridge'
import { BridgeChain, ChainNames, EVMDexType } from '@rarimo/shared'
import type { TokenInfo } from '@uniswap/token-lists'

import { DEFAULT_FETCHER_CONFIG } from '@/config'
import {
  BINANCE_TOKEN_LIST,
  ETH_TOKEN_LIST,
  PANCAKE_SWAP_TESTNET_TOKEN_LIST,
  TRADER_JOE_SWAP_TESTNET_TOKEN_LIST,
} from '@/const'
import { errors } from '@/errors'
import type { Config } from '@/types'

export const loadTokens = async (
  config: Config,
  chain: BridgeChain,
): Promise<Token[]> => {
  if (chain.name === ChainNames.Chapel) {
    return [tokenFromChain(chain), ...PANCAKE_SWAP_TESTNET_TOKEN_LIST]
  }

  if (chain.name === ChainNames.Fuji) {
    return [tokenFromChain(chain), ...TRADER_JOE_SWAP_TESTNET_TOKEN_LIST]
  }

  const rawUrl = getTokenListUrl(chain, config)
  const url = new URL(rawUrl)

  if (!url) {
    throw new errors.OperationChainNotSupportedError()
  }

  const { data } = await new Fetcher(DEFAULT_FETCHER_CONFIG)
    .withBaseUrl(url.origin)
    .get<{ tokens: Array<TokenInfo> } | Array<TokenInfo>>(url.pathname)

  if (!data) throw new errors.OperationSupportedTokensLoadFailedError()

  const tokens = Array.isArray(data) ? data : data.tokens

  if (!tokens.length) return []

  return [
    tokenFromChain(chain),
    ...appendExternalTokens(chain),
    ...tokens.reduce((acc, token) => {
      if (Number(token.chainId) === Number(chain.id)) {
        acc.push(tokenFromTokenInfo(token, chain))
      }

      return acc
    }, [] as Token[]),
  ]
}

const appendExternalTokens = (chain: BridgeChain): Token[] => {
  if (chain.name === ChainNames.Ethereum) {
    return ETH_TOKEN_LIST
  }

  if (chain.name === ChainNames.BinanceSmartChain) {
    return BINANCE_TOKEN_LIST
  }

  return []
}

const getTokenListUrl = (chain: BridgeChain, config: Config): string => {
  return {
    [EVMDexType.PancakeSwap]: config.PANCAKE_SWAP_TOKEN_LIST_URL,
    [EVMDexType.TraderJoe]: config.TRADER_JOE_TOKEN_LIST_URL,
    [EVMDexType.UniswapV3]: config.UNISWAP_V3_TOKEN_LIST_URL,
    [EVMDexType.QuickSwap]: config.QUICK_SWAP_TOKEN_LIST_URL,
  }[chain.dexType]
}

const tokenFromTokenInfo = (token: TokenInfo, chain: BridgeChain): Token => {
  return newToken({
    chain,
    address: token.address,
    name: token.name,
    symbol: token.symbol,
    decimals: token.decimals,
    logoURI: token.logoURI,
  })
}

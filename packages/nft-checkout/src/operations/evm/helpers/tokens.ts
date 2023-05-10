import { Fetcher } from '@distributedlab/fetcher'
import { newToken, Token, tokenFromChain } from '@rarimo/bridge'
import { BridgeChain, ChainNames, EVMSwapContractVersion } from '@rarimo/shared'
import type { TokenInfo } from '@uniswap/token-lists'

import { DEFAULT_FETCHER_CONFIG } from '@/config'
import {
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
    ...tokens.reduce((acc, token) => {
      if (Number(token.chainId) === Number(chain.id)) {
        acc.push(tokenFromTokenInfo(token, chain))
      }

      return acc
    }, [] as Token[]),
  ]
}

const getTokenListUrl = (chain: BridgeChain, config: Config): string => {
  return {
    [EVMSwapContractVersion.PancakeSwap]: config.PANCAKE_SWAP_TOKEN_LIST_URL,
    [EVMSwapContractVersion.TraderJoe]: config.TRADER_JOE_TOKEN_LIST_URL,
    [EVMSwapContractVersion.UniswapV3]: config.UNISWAP_V3_TOKEN_LIST_URL,
    [EVMSwapContractVersion.QuickSwap]: config.QUICK_SWAP_TOKEN_LIST_URL,
  }[chain.contractVersion]
}

const tokenFromTokenInfo = (token: TokenInfo, chain: BridgeChain): Token => {
  return newToken(
    chain,
    token.address,
    token.name,
    token.symbol,
    token.decimals,
    token.logoURI,
  )
}

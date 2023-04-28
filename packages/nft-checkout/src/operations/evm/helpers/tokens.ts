import { Fetcher } from '@distributedlab/fetcher'
import type { TokenInfo } from '@uniswap/token-lists'

import { DEFAULT_FETCHER_CONFIG } from '@/config'
import {
  PANCAKE_SWAP_TESTNET_TOKEN_LIST,
  TRADER_JOE_SWAP_TESTNET_TOKEN_LIST,
} from '@/const'
import { Token } from '@/entities'
import { ChainNames, SwapContractVersion } from '@/enums'
import { errors } from '@/errors'
import type { BridgeChain, Config } from '@/types'

export const loadTokens = async (
  config: Config,
  chain: BridgeChain,
): Promise<Token[]> => {
  if (chain.name === ChainNames.Chapel) {
    return [Token.fromChain(chain), ...PANCAKE_SWAP_TESTNET_TOKEN_LIST]
  }

  if (chain.name === ChainNames.Fuji) {
    return [Token.fromChain(chain), ...TRADER_JOE_SWAP_TESTNET_TOKEN_LIST]
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
    Token.fromChain(chain),
    ...tokens.reduce((acc, token) => {
      if (Number(token.chainId) === Number(chain.id)) {
        acc.push(Token.fromTokenInfo(token, chain))
      }

      return acc
    }, [] as Token[]),
  ]
}

const getTokenListUrl = (chain: BridgeChain, config: Config): string => {
  return {
    [SwapContractVersion.PancakeSwap]: config.PANCAKE_SWAP_TOKEN_LIST_URL,
    [SwapContractVersion.TraderJoe]: config.TRADER_JOE_TOKEN_LIST_URL,
    [SwapContractVersion.UniswapV3]: config.UNISWAP_V3_TOKEN_LIST_URL,
    [SwapContractVersion.QuickSwap]: config.QUICK_SWAP_TOKEN_LIST_URL,
  }[chain.contactVersion]
}

import { TokenInfo } from '@uniswap/token-lists'
import axios from 'axios'

import {
  PANCAKE_SWAP_TESTNET_TOKEN_LIST,
  TRADER_JOE_SWAP_TESTNET_TOKEN_LIST,
} from '@/const'
import { Token } from '@/entities'
import { ChainNames, SwapContractVersion } from '@/enums'
import { errors } from '@/errors'
import { BridgeChain, Config } from '@/types'

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

  const url = getTokenListUrl(chain, config)

  if (!url) {
    throw new errors.OperationChainNotSupportedError()
  }

  const { data }: { data: { tokens: Array<TokenInfo> } | Array<TokenInfo> } =
    await axios.get(url)

  if (!data) throw new errors.OperationSupportedTokensLoadFailedError()

  const tokens = Array.isArray(data) ? data : data.tokens

  if (!tokens.length) return []

  return tokens.reduce((acc, token) => {
    if (Number(token.chainId) === Number(chain.id)) {
      acc.push(Token.fromTokenInfo(token, chain))
    }

    return [Token.fromChain(chain), ...acc]
  }, [] as Token[])
}

const getTokenListUrl = (chain: BridgeChain, config: Config): string => {
  return {
    [SwapContractVersion.PancakeSwap]: config.PANCAKE_SWAP_TOKEN_LIST_URL,
    [SwapContractVersion.TraderJoe]: config.TRADER_JOE_TOKEN_LIST_URL,
    [SwapContractVersion.UniswapV3]: config.UNISWAP_V3_TOKEN_LIST_URL,
  }[chain.contactVersion]
}

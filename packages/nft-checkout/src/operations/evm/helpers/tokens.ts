import axios from 'axios'

import { BridgeChain, Config, Token } from '../../../types'
import { errors } from '@rarimo/provider'
import { TokenInfo } from '@uniswap/token-lists'
import { isV2 } from './chain'

export const loadTokens = async (
  config: Config,
  chain: BridgeChain,
): Promise<Token[]> => {
  const url = isV2(chain) ? config.V2_TOKEN_LIST : config.V3_TOKEN_LIST

  if (!url) {
    throw new errors.OperationChainNotSupportedError()
  }

  const { data }: { data: { tokens: Array<TokenInfo> } } = await axios.get(url)

  if (!data) throw new errors.OperationSupportedTokensLoadFailedError()

  if (!data.tokens.length) return []

  return data.tokens
    .reduce((acc, token) => {
      if (Number(token.chainId) === Number(chain.id)) {
        acc.push(tokenFromTokenInfo(token, chain))
      }

      return acc
    }, [] as Token[])
    .sort((a, b) => a.symbol.localeCompare(b.symbol))
}

const tokenFromTokenInfo = (token: TokenInfo, chain: BridgeChain): Token => ({
  chain,
  address: token.address,
  name: token.name,
  symbol: token.symbol,
  decimals: token.decimals,
  logoURI: token.logoURI,
})

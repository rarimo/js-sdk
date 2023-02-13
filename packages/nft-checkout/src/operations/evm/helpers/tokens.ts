import axios from 'axios'

import { Config, Token } from '@/types'
import { errors } from '@rarimo/provider'
import { TokenInfo } from '@uniswap/token-lists'
import { isAvalanche, isEthereum } from './chain'

export const loadTokens = async (
  config: Config,
  chainId: number,
): Promise<Token[]> => {
  const url = getUrl(config, chainId)

  if (!url) {
    throw new errors.OperationChainNotSupportedError()
  }

  const { data }: { data: { tokens: Array<TokenInfo> } } = await axios.get(url)

  if (!data) throw new errors.OperationSupportedTokensLoadFailedError()

  if (!data.tokens.length) return []

  return data.tokens
    .reduce((acc, token) => {
      if (token.chainId === chainId) acc.push(tokenFromTokenInfo(token))

      return acc
    }, [] as Token[])
    .sort((a, b) => a.symbol.localeCompare(b.symbol))
}

const tokenFromTokenInfo = (token: TokenInfo): Token => ({
  chainId: token.chainId,
  address: token.address,
  name: token.name,
  symbol: token.symbol,
  decimals: token.decimals,
  logoURI: token.logoURI,
})

const getUrl = (config: Config, chainId: number) => {
  if (isEthereum(chainId)) {
    return config.UNISWAP_TOKEN_LIST
  }

  if (isAvalanche(chainId)) {
    return config.TRADER_JOE_TOKEN_LIST
  }

  return ''
}

import { BridgeChain, Config, Token } from '../../../types'
import { ChainNames, SwapContractVersion } from '../../../enums'
import { errors } from '../../../errors'

import axios from 'axios'
import { TokenInfo } from '@uniswap/token-lists'
import { PANCAKE_SWAP_TESTNET_TOKEN_LIST } from '../../../const/tokens'

export const loadTokens = async (
  config: Config,
  chain: BridgeChain,
): Promise<Token[]> => {
  if (chain.name === ChainNames.Chapel) {
    return PANCAKE_SWAP_TESTNET_TOKEN_LIST
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

  return tokens
    .reduce((acc, token) => {
      if (Number(token.chainId) === Number(chain.id)) {
        acc.push(tokenFromTokenInfo(token, chain))
      }

      return acc
    }, [] as Token[])
    .sort((a, b) => a.symbol.localeCompare(b.symbol))
}

const getTokenListUrl = (chain: BridgeChain, config: Config): string => {
  return {
    [SwapContractVersion.PancakeSwap]: config.PANCAKE_SWAP_TOKEN_LIST_URL,
    [SwapContractVersion.TraderJoe]: config.TRADER_JOE_TOKEN_LIST_URL,
    [SwapContractVersion.UniswapV3]: config.UNISWAP_V3_TOKEN_LIST_URL,
  }[chain.contactVersion]
}

const tokenFromTokenInfo = (token: TokenInfo, chain: BridgeChain): Token => ({
  chain,
  address: token.address,
  name: token.name,
  symbol: token.symbol,
  decimals: token.decimals,
  logoURI: token.logoURI,
})

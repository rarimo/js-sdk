import { TokenInfo } from '@uniswap/token-lists'

import { getDexProps } from '@/helpers'
import { EthereumTokenBalance, SelectedChainInfo } from '@/types'
import axios from 'axios'

import { nftCheckoutContext } from '@/context/NftCheckoutContext'

type TokenList = {
  tokens: Array<TokenInfo>
  tokenBalancesPromise: Promise<Array<EthereumTokenBalance>>
}

export const useTokenList = async ({
  chainId,
  chainName,
  userWalletAddress,
}: SelectedChainInfo): Promise<TokenList> | never => {
  if (!chainId) {
    throw new Error('Please provide proper chainId')
  }

  const jsonRPCUrlMap = nftCheckoutContext.jsonRPCUrlMap
  const { tokenListUrl, tokenBalancesFetcher } = getDexProps(chainName)

  let tokens
  let tokenBalancesPromise

  const { data }: { data: { tokens: Array<TokenInfo> } } = await axios.get(
    tokenListUrl,
  )

  if (data) {
    /*
     * Filter because for evm chains every token is included i.e mainnet and testnet ones.
     * For evm chains: we filter by chainId
     * For Solana, Near: chainId doesnt exist. Must be something else
     */
    const allTokens = data.tokens // .concat(DEMO_TOKENS);
    tokens = chainId
      ? allTokens.filter(token => token.chainId === chainId)
      : allTokens

    tokens.sort((a, b) => a.symbol.localeCompare(b.symbol))

    if (jsonRPCUrlMap && !jsonRPCUrlMap[chainName])
      throw new Error('Please provide proper JsonRPCUrlMap')

    tokenBalancesPromise = tokenBalancesFetcher({
      tokens,
      userWalletAddress,
      jsonRpcUrl: jsonRPCUrlMap[chainName] as string,
      chainId,
    })
  } else {
    throw new Error('Something went wrong with tokenListUrl')
  }

  return { tokens, tokenBalancesPromise }
}

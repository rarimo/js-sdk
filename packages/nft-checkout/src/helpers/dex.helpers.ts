import { CONFIG } from '@/config'
import { CHAIN_NAME } from '@/const'
import { TChainName } from '@/types'

import { useTraderJoe, useAlphaRouter, useEthereumTokenBalances } from '@/hooks'

const { UNISWAP_TOKEN_LIST, TRADER_JOE_TOKEN_LIST } = CONFIG

export const getDexProps = (paymentChain: TChainName) => {
  let swapPriceFetcher
  let tokenListUrl
  let tokenBalancesFetcher

  switch (paymentChain) {
    case CHAIN_NAME.ethereum:
    case CHAIN_NAME.goerli:
    case CHAIN_NAME.polygon:
    case CHAIN_NAME.mumbai:
      swapPriceFetcher = useAlphaRouter
      tokenListUrl = UNISWAP_TOKEN_LIST
      tokenBalancesFetcher = useEthereumTokenBalances
      break
    case CHAIN_NAME.avalanche:
    case CHAIN_NAME.fuji:
      swapPriceFetcher = useTraderJoe
      tokenListUrl = TRADER_JOE_TOKEN_LIST
      tokenBalancesFetcher = useEthereumTokenBalances
      break
    // case CHAIN_NAME.bsc:
    //   // usePancakeswap
    //   break
    // case CHAIN_NAME.solana:
    //   // useRaydium
    //   break
    // case CHAIN_NAME.near:
    //   // useReffinace:
    //   break
    default:
      throw new Error('Unsupported payment chain provided')
  }

  return { swapPriceFetcher, tokenListUrl, tokenBalancesFetcher }
}

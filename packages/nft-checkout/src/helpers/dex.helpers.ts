import { CONFIG } from '@/config'
import { ChainName } from '@/enums'
import { useEthereumTokenBalances } from '@/hooks/useTokenBalances'

import { useTraderJoe } from '../hooks/useTraderJoe'
import { useAlphaRouter } from '../hooks/useUniswap'

const { UNISWAP_TOKEN_LIST, TRADER_JOE_TOKEN_LIST } = CONFIG

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getDexProps = (paymentChain: ChainName): any => {
  let swapPriceFetcher
  let tokenListUrl
  let tokenBalancesFetcher
  switch (paymentChain) {
    case ChainName.ethereum:
    case ChainName.goerli:
    case ChainName.polygon:
    case ChainName.mumbai:
      swapPriceFetcher = useAlphaRouter
      tokenListUrl = UNISWAP_TOKEN_LIST
      tokenBalancesFetcher = useEthereumTokenBalances
      break
    case ChainName.avalanche:
    case ChainName.fuji:
      swapPriceFetcher = useTraderJoe
      tokenListUrl = TRADER_JOE_TOKEN_LIST
      tokenBalancesFetcher = useEthereumTokenBalances
      break
    case ChainName.bsc:
      // usePancakeswap
      break
    case ChainName.solana:
      // useRaydium
      break
    case ChainName.near:
      // useReffinace:
      break
    default:
      throw new Error('Unsupported payment chain provided')
  }

  return { swapPriceFetcher, tokenListUrl, tokenBalancesFetcher }
}

export { getDexProps }

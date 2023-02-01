import { TokenInfo } from '@uniswap/token-lists'

import { ChainName } from '@/enums'
import { JsonRPCUrlMap } from '@/types'

export interface TokenInfoWithBalance extends TokenInfo {
  balance: string
}

export interface SwapPriceInput {
  chainId: number
  jsonRPCUrlMap: JsonRPCUrlMap
  inputAmount: string
  inputToken: TokenInfo | TokenInfoWithBalance
  outputToken: TokenInfo | TokenInfoWithBalance
  paymentChainName: ChainName
  userWalletAddress: string
}

export interface SelectedChainInfo {
  shouldFetch: boolean
  chainId: number
  chainName: ChainName
}

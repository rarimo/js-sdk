import { TokenInfo } from '@uniswap/token-lists'

import { JsonRPCUrlMap, TChainIds, TChainName } from '@/types'
import { Percent } from '@uniswap/sdk-core'

export interface TokenInfoWithBalance extends TokenInfo {
  balance: string
}

export interface SwapPriceInput {
  chainId: number
  jsonRPCUrlMap: JsonRPCUrlMap
  inputAmount: string
  inputToken: TokenInfo | TokenInfoWithBalance
  outputToken: TokenInfo | TokenInfoWithBalance
  paymentChainName: TChainName
  userWalletAddress: string
}

export interface SelectedChainInfo {
  chainId: TChainIds
  chainName: TChainName
  userWalletAddress: string
}

export type EstimatedPrice = {
  gasPriceInUsd: string | null
  estimatedPriceInToken: string
  selectedTokenSymbol: string
  impact: {
    percent: Percent
  }
  gasLimit?: number
  notEnoughTokens?: boolean
}

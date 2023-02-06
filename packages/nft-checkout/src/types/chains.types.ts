import { CHAIN_IDS, CHAIN_NAME } from '@/const'

export type Chain = {
  contractAddress: string
  chainId: number
  symbol: string
  chainType: string
  icon: string
  name: TChainName
  displayName: string
}

export type Network = {
  chainId: number
  name?: string
  ensAddress?: string
}

export type WalletInfo = {
  currentAddress: string
  currentNetwork: Network
}

export type TChainName = (typeof CHAIN_NAME)[keyof typeof CHAIN_NAME]
export type TChainIds = (typeof CHAIN_IDS)[keyof typeof CHAIN_IDS]

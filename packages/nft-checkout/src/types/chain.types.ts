import { ChainName } from '@/enums'

export type Chain = {
  contractAddress: string
  chainId: number
  symbol: string
  chainType: string
  icon: string
  name: ChainName
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

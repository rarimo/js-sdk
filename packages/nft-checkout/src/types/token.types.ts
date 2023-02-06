import { TChainName } from '@/types'

export interface EthereumTokenBalance {
  address: string
  contractAddress: string
  decimals: number
  symbol: string
  name: string
  balance: string
}

export interface NFTDetails {
  price: string
  chainName: TChainName
  id: string
  symbol: string
}

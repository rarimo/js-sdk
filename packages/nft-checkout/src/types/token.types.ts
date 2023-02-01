import { ChainName } from '@/enums'

export interface TokenBalance {
  balance: string
  chain: string
  chainId: number
}

export interface NFTDetails {
  price: string
  chainName: ChainName // make it enum?
  id: string
  symbol: string
}

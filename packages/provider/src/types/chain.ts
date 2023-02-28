import { ChainTypes } from '../enums'

export type ChainId = string | number

export type Chain = {
  id: ChainId
  name: string
  rpcUrl: string
  explorerUrl: string
  token: {
    name: string
    symbol: string
    decimals: number
  }
  type: ChainTypes
  icon: string
}

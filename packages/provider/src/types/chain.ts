import { ChainTypes } from '../enums'

export type ChainId = string | number

export type Chain = {
  id: ChainId
  name: string
  rpcUrl: string
  explorerUrl: string
  symbol: string
  type: ChainTypes
  icon: string
}

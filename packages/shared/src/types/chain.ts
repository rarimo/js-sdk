import type { ChainTypes } from '@/enums'
import type { ChainNames, EVMDexType } from '@/enums'

import type { Address } from './common'

export type ChainId = string | number

export type Chain = {
  id: ChainId
  name: ChainNames
  rpcUrl: string
  explorerUrl: string
  token: {
    name: string
    symbol: string
    decimals: number
  }
  type: ChainTypes
  icon: string
  isTestnet: boolean
}

export type BridgeChain = Chain & {
  bridgeFacadeAddress: Address
  contractAddress: Address
  dexType: EVMDexType
}

export type ChainIdMap = { [key in ChainNames]?: ChainId }

import type { ChainTypes } from '@/enums'
import type { ChainNames, EVMDexType } from '@/enums'

import type { Address } from './common'

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
  isTestnet: boolean
}

export type BridgeChain = Chain & {
  contractAddress: Address
  dexType: EVMDexType
}

export type ChainIdMap = { [key in ChainNames]?: ChainId }

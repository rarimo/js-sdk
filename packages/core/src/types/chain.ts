import type { ChainTypes } from '@/enums'
import type { ChainNames, EVMSwapContractVersion } from '@/enums'

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
}

export type BridgeChain = Chain & {
  contractAddress: Address
  contractVersion: EVMSwapContractVersion
}

export type ChainIdMap = { [key in ChainNames]?: ChainId }

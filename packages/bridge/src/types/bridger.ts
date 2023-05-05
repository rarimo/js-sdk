import type { IProvider } from '@rarimo/provider'
import type { BridgeChain, ChainTypes } from '@rarimo/shared'

import type { DestinationTransaction } from '@/types'

export interface IBridger {
  provider: IProvider
  chains: BridgeChain[]
  chainType: ChainTypes
  isInitialized: boolean

  init(): Promise<void>
  loadSupportedChains(): Promise<BridgeChain[]>
  getDestinationTx(
    sourceChain: BridgeChain,
    sourceTxHash: string,
  ): Promise<DestinationTransaction>
}

export type IBridgerCreateFn = (p: IProvider) => IBridger

import type { IProvider } from '@rarimo/provider'
import {
  BridgeChain,
  ChainId,
  CHAINS,
  ChainTypes,
  HexString,
  ref,
  toRaw,
} from '@rarimo/shared'

import { errors } from '@/errors'
import type {
  DestinationTransaction,
  IBridger,
  IBridgerCreateFn,
} from '@/types'

import { getDestinationTx as fetchDestTx } from './get-destination-tx'

export const createEVMBridger: IBridgerCreateFn = (p: IProvider): IBridger => {
  const provider = ref(p)
  const chains = ref<BridgeChain[]>([])
  const isInitialized = ref(false)

  const getChainById = (id: ChainId) => {
    return chains.value.find(chain => chain.id === id)
  }

  /**
   * Get the chains that are supported for the bridging
   *
   * @returns A list of supported chains and information about them
   */
  const loadSupportedChains = async (): Promise<BridgeChain[]> => {
    // TODO: add backend integration
    if (!chains.value.length) chains.value = CHAINS[ChainTypes.EVM]!
    return chains.value
  }

  const getDestinationTx = async (
    sourceChain: BridgeChain,
    sourceTxHash: HexString,
  ): Promise<DestinationTransaction> => {
    if (!isInitialized.value) {
      throw new errors.BridgerNotInitializedError()
    }

    if (!getChainById(sourceChain.id)) {
      throw new errors.BridgerInvalidChainTypeError()
    }

    return fetchDestTx(sourceChain, sourceTxHash)
  }

  const init = async () => {
    if (isInitialized.value) return
    await loadSupportedChains()
    isInitialized.value = true
  }

  return toRaw({
    chainType: ChainTypes.EVM,
    provider,
    chains,
    isInitialized,
    init,
    loadSupportedChains,
    getDestinationTx,
  })
}

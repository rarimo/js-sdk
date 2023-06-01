import type { IProvider } from '@rarimo/provider'
import type { BridgeChain, ChainId, HexString } from '@rarimo/shared'
import { Amount, CHAINS, ChainTypes, ref, toRaw } from '@rarimo/shared'

import { errors } from '@/errors'
import type { Bridger, BridgerCreateFn, DestinationTransaction } from '@/types'
import type { Token } from '@/types'

import {
  approve as _approve,
  approveIfNeeded as _approveIfNeeded,
  isApproveERC20Required,
} from './approve-if-needed'
import {
  fetchInternalTokenMapping,
  getDestinationTx as fetchDestTx,
} from './get-destination-tx'

export const createEVMBridger: BridgerCreateFn = (p: IProvider): Bridger => {
  const provider = ref(p)
  const chains = ref<BridgeChain[]>([])
  const isInitialized = ref(false)

  const getChainById = (id: ChainId) => {
    return chains.value.find(chain => chain.id === id)
  }

  const loadSupportedChains = async (): Promise<BridgeChain[]> => {
    // TODO: add backend integration
    if (!chains.value.length) chains.value = CHAINS[ChainTypes.EVM]!
    return chains.value
  }

  const init = async () => {
    if (isInitialized.value) return
    await loadSupportedChains()
    isInitialized.value = true
  }

  const getDestinationTx = async (
    sourceChain: BridgeChain,
    sourceTxHash: HexString,
  ): Promise<DestinationTransaction> => {
    await init()

    if (!getChainById(sourceChain.id)) {
      throw new errors.BridgerInvalidChainTypeError()
    }

    return fetchDestTx(sourceChain, sourceTxHash)
  }

  const getInternalTokenMapping = (targetTokenSymbol: string) => {
    return fetchInternalTokenMapping(targetTokenSymbol)
  }

  const approveIfNeeded = async (
    token: Token,
    operator: HexString,
    amount?: Amount,
  ) => {
    return _approveIfNeeded(provider.value, operator, token, amount)
  }

  const approve = async (token: Token, operator: HexString) => {
    return _approve(provider.value, operator, token)
  }

  const isApproveRequired = async (
    token: Token,
    operator: HexString,
    amount?: Amount,
  ) => {
    return isApproveERC20Required(provider.value, operator, token, amount)
  }

  return toRaw({
    chainType: ChainTypes.EVM,
    provider,
    chains,
    isInitialized,
    init,
    loadSupportedChains,
    getDestinationTx,
    getInternalTokenMapping,
    isApproveRequired,
    approve,
    approveIfNeeded,
  })
}

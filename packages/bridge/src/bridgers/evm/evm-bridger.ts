import { ref, toRaw } from '@distributedlab/reactivity'
import type { IProvider } from '@rarimo/provider'
import type {
  BridgeChain,
  ChainId,
  DestinationTransaction,
  HexString,
} from '@rarimo/shared'
import {
  Amount,
  ChainKind,
  ChainTypes,
  fetchInternalTokenMapping,
  getDestinationTx as fetchDestTx,
  loadSupportedChains,
} from '@rarimo/shared'

import { errors } from '@/errors'
import type { Bridger, BridgerCreateFn } from '@/types'
import type { Token } from '@/types'

import {
  approve as _approve,
  approveIfNeeded as _approveIfNeeded,
  isApproveERC20Required,
} from './approve-if-needed'

export const createEVMBridger: BridgerCreateFn = (p: IProvider): Bridger => {
  const provider = p
  const chains = ref<BridgeChain[]>([])
  const isInitialized = ref(false)

  const supportedChains = async (kind?: ChainKind): Promise<BridgeChain[]> => {
    if (chains.value.length) return chains.value

    chains.value = await loadSupportedChains({
      type: ChainTypes.EVM,
      kind,
    })

    return chains.value
  }

  const getChainById = (id: ChainId) => {
    return chains.value.find(chain => Number(chain.id) === Number(id))
  }

  const init = async () => {
    if (isInitialized.value) return
    await supportedChains()
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
    return _approveIfNeeded(provider, operator, token, amount)
  }

  const approve = async (token: Token, operator: HexString) => {
    return _approve(provider, operator, token)
  }

  const isApproveRequired = async (
    token: Token,
    operator: HexString,
    amount?: Amount,
  ) => {
    return isApproveERC20Required(provider, operator, token, amount)
  }

  return toRaw({
    chainType: ChainTypes.EVM,
    provider,
    chains,
    isInitialized,
    init,
    supportedChains,
    getChainById,
    getDestinationTx,
    getInternalTokenMapping,
    isApproveRequired,
    approve,
    approveIfNeeded,
  })
}

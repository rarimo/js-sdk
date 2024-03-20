import { ref, toRaw } from '@distributedlab/reactivity'
import type { IProvider } from '@rarimo/provider'
import type {
  Address,
  BridgeChain,
  ChainId,
  DestinationTransaction,
  HexString,
} from '@rarimo/shared'
import {
  Amount,
  ChainKind,
  ChainTypes,
  FEE_MANAGER_ABI,
  getDestinationTx as fetchDestTx,
  getSupportedChains as getChains,
  NATIVE_TOKEN_ADDRESS,
} from '@rarimo/shared'
import { Contract } from 'ethers'

import { errors } from '@/errors'
import type { Bridger, BridgerCreateFn, Token } from '@/types'

import {
  approve as _approve,
  approveIfNeeded as _approveIfNeeded,
  isApproveERC20Required,
} from './approve-if-needed'

export const createEVMBridger: BridgerCreateFn = (
  provider: IProvider,
): Bridger => {
  const chains = ref<BridgeChain[]>([])
  const isInitialized = ref(false)

  const getSupportedChains = async (
    kind?: ChainKind,
  ): Promise<BridgeChain[]> => {
    if (chains.value.length) return chains.value

    chains.value = await getChains({
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
    await getSupportedChains()
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

  const approveIfNeeded = async (
    token: Token,
    operator: Address,
    amount?: Amount,
  ) => {
    return _approveIfNeeded(provider, operator, token, amount)
  }

  const approve = async (token: Token, operator: Address) => {
    return _approve(provider, operator, token)
  }

  const isApproveRequired = async (
    token: Token,
    operator: Address,
    amount?: Amount,
  ) => {
    return isApproveERC20Required(provider, operator, token, amount)
  }

  const getCommission = async (chain: BridgeChain, token: Token) => {
    if (Number(chain.id) !== Number(provider.chainId)) {
      throw new TypeError('provided chain is not the same as current')
    }

    const facade = new Contract(
      chain.bridgeFacadeAddress,
      FEE_MANAGER_ABI,
      provider.getWeb3Provider?.(),
    )

    const amount = await facade.getCommission(
      token.isNative ? NATIVE_TOKEN_ADDRESS : token.address,
    )

    const commission = Amount.fromBigInt(amount, token.decimals)

    if (commission.isZero) throw new errors.BridgerZeroCommissionError()

    return commission
  }

  return toRaw({
    chainType: ChainTypes.EVM,
    provider,
    chains,
    isInitialized,
    init,
    getSupportedChains,
    getChainById,
    getDestinationTx,
    isApproveRequired,
    approve,
    approveIfNeeded,
    getCommission,
  })
}

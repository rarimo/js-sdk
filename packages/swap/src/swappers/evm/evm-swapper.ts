import { createBridger, createEVMBridger } from '@rarimo/bridge'
import type { IProvider } from '@rarimo/provider'
import { computed, ref, toRaw } from '@rarimo/shared'

import type { ExecuteArgs, Swapper } from '@/types'

import { getExecuteData } from './get-execute-data'

export const createEVMSwapper = (p: IProvider): Swapper => {
  const provider = ref(p)
  const bridger = ref(createBridger(createEVMBridger, p))
  const isInitialized = ref(false)

  const init = async () => {
    if (isInitialized.value) return
    await bridger.value.init()
    isInitialized.value = true
  }

  const execute = async (args: ExecuteArgs) => {
    await init()

    const { from, amountIn, handleAllowance } = args

    if (handleAllowance) {
      await bridger.value.approveIfNeeded(
        from,
        from.chain.contractAddress,
        amountIn,
      )
    }

    return provider.value.signAndSendTx({
      from: provider.value.address,
      to: from.chain.contractAddress,
      data: getExecuteData(args),
      ...(from.isNative
        ? {
            value: amountIn.value,
          }
        : {}),
    })
  }

  return toRaw({
    chains: computed(() => bridger.value.chains),
    isInitialized,
    provider,
    init,
    execute,
    chainType: bridger.value.chainType,
    isApproveRequired: bridger.value.isApproveRequired.bind(bridger.value),
    getDestinationTx: bridger.value.getDestinationTx.bind(bridger.value),
    supportedChains: bridger.value.loadSupportedChains.bind(bridger.value),
    approveIfNeeded: bridger.value.approveIfNeeded.bind(bridger.value),
    approve: bridger.value.approve.bind(bridger.value),
    getInternalTokenMapping: bridger.value.getInternalTokenMapping.bind(
      bridger.value,
    ),
  })
}

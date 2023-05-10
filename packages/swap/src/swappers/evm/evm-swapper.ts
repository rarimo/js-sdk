import { createBridger, createEVMBridger } from '@rarimo/bridge'
import type { IProvider } from '@rarimo/provider'
import { BridgeChain, computed, ref, toRaw } from '@rarimo/shared'

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

  const getDestinationTx = async (
    sourceChain: BridgeChain,
    sourceTxHash: string,
  ) => {
    await init()
    return bridger.value.getDestinationTx(sourceChain, sourceTxHash)
  }

  const execute = async (args: ExecuteArgs) => {
    await init()

    const { from, amountIn } = args

    await bridger.value.approveIfNeeded(
      from,
      from.chain.contractAddress,
      amountIn,
    )

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
    chainType: bridger.value.chainType,
    chains: computed(() => bridger.value.chains),
    isInitialized,
    provider,
    init,
    getDestinationTx,
    execute,
  })
}

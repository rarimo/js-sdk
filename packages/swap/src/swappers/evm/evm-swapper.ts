import { extend, ref, toRaw } from '@distributedlab/reactivity'
import { createBridger, createEVMBridger } from '@rarimo/bridge'
import type { IProvider } from '@rarimo/provider'

import type { ExecuteArgs, Swapper } from '@/types'

import { getExecuteData } from './get-execute-data'

export const createEVMSwapper = (p: IProvider): Swapper => {
  const provider = p
  const bridger = createBridger(createEVMBridger, p)
  const isInitialized = ref(false)

  const init = async () => {
    if (isInitialized.value) return
    await bridger.init()
    isInitialized.value = true
  }

  const execute = async (args: ExecuteArgs) => {
    await init()

    const { from, amountIn, handleAllowance } = args

    if (handleAllowance) {
      await bridger.approveIfNeeded(from, from.chain.contractAddress, amountIn)
    }

    return provider.signAndSendTx({
      from: provider.address,
      to: from.chain.contractAddress,
      data: getExecuteData(args),
      ...(from.isNative
        ? {
            value: amountIn.value,
          }
        : {}),
    })
  }

  return toRaw(
    extend(bridger, {
      bridger,
      isInitialized,
      init,
      execute,
    }),
  )
}

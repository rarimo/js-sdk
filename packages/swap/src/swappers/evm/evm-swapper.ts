import { extend, ref, toRaw } from '@distributedlab/reactivity'
import { createBridger, createEVMBridger } from '@rarimo/bridge'
import type { IProvider } from '@rarimo/provider'
import { isArray } from '@rarimo/shared'

import type { ExecuteArgs, MultiplePaymentOpts, Swapper } from '@/types'

import { getExecuteData } from './get-execute-data'

export const createEVMSwapper = (provider: IProvider): Swapper => {
  const bridger = createBridger(createEVMBridger, provider)
  const isInitialized = ref(false)

  const init = async () => {
    if (isInitialized.value) return
    await bridger.init()
    isInitialized.value = true
  }

  const execute = async (
    args: ExecuteArgs | ExecuteArgs[],
    multiplePaymentOpts?: MultiplePaymentOpts,
  ) => {
    const executeArgs = isArray(args) ? args : [args]

    await init()
    await approveMultipleIfNeeded(executeArgs)

    const contractAddress = executeArgs[0].from.chain.contractAddress
    const value = getTxValue(executeArgs)

    return provider.signAndSendTx({
      from: provider.address,
      to: contractAddress,
      data: getExecuteData(executeArgs, multiplePaymentOpts),
      ...(value && { value }),
    })
  }

  const approveMultipleIfNeeded = async (executeArgs: ExecuteArgs[]) => {
    for (const arg of executeArgs) {
      const { from, amountIn } = arg
      await bridger.approveIfNeeded(from, from.chain.contractAddress, amountIn)
    }
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

const getTxValue = (args: ExecuteArgs[]) => {
  const estimationWithNativeInput = args.find(i => i.from.isNative)
  return estimationWithNativeInput && estimationWithNativeInput.amountIn.value
}

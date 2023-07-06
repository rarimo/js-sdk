import { extend, ref, toRaw } from '@distributedlab/reactivity'
import { createBridger, createEVMBridger } from '@rarimo/bridge'
import type { IProvider } from '@rarimo/provider'

import type { ExecuteArgs, Swapper } from '@/types'

import { getExecuteData } from './get-execute-data'

/**
 * @description Instead of using this function directly, run token swaps as transactions with the [@rarimo/nft-checkout]() package.
 * For more information about swaps, see [Swapping tokens](https://docs.rarimo.com/overview/swapping-tokens) in the Rarimo documentation.
 */
export const createEVMSwapper = (provider: IProvider): Swapper => {
  const bridger = createBridger(createEVMBridger, provider)
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

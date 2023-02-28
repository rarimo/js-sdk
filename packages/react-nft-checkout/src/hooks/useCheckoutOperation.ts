import {
  BridgeChain,
  createCheckoutOperation,
  CreateCheckoutOperationParams,
  EVMOperation,
  INFTCheckoutOperation,
  Target,
} from '@rarimo/nft-checkout'
import { IProvider } from '@rarimo/provider'
import { useCallback, useEffect, useState } from 'react'

type Props = {
  provider: IProvider | null
  createCheckoutOperationParams?: CreateCheckoutOperationParams
  selectedChainState: [
    BridgeChain | undefined,
    React.Dispatch<React.SetStateAction<BridgeChain | undefined>>,
  ]
  targetNft: Target
}

export const useCheckoutOperation = ({
  provider,
  createCheckoutOperationParams,
  selectedChainState,
  targetNft,
}: Props) => {
  const [, setSelectedChain] = selectedChainState

  const [checkoutOperation, setCheckoutOperation] =
    useState<INFTCheckoutOperation | null>(null)
  const [checkoutOperationReactiveState, setCheckoutOperationReactiveState] =
    useState(() => {
      return {
        isInitialized: checkoutOperation?.isInitialized,
        chainFrom: checkoutOperation?.chainFrom,
      }
    })

  const setListeners = useCallback(() => {
    if (!checkoutOperation) return

    checkoutOperation.onInitiated(({ chainFrom, isInitiated }) => {
      setCheckoutOperationReactiveState(prev => ({
        ...prev,
        chainFrom,
        isInitiated,
      }))
    })
  }, [checkoutOperation])

  useEffect(() => {
    if (!provider) return

    const op = createCheckoutOperation(
      EVMOperation,
      provider,
      createCheckoutOperationParams,
    )
    setCheckoutOperation(op)
  }, [createCheckoutOperationParams, provider])

  useEffect(() => {
    if (!checkoutOperation) return

    const init = async () => {
      // Call asynchronous supportedChains method to get supported chains on selected chain type
      const chains = await checkoutOperation.supportedChains()

      // In our case we hardcode Goerli chain as selected chain
      const targetChain = chains[3]
      setSelectedChain(targetChain)

      await checkoutOperation.init({
        chainIdFrom: targetChain.id,
        target: targetNft,
      })
    }

    init()
  }, [checkoutOperation, setSelectedChain, targetNft])

  useEffect(() => {
    setListeners()

    return () => {
      checkoutOperation?.clearHandlers()
    }
  }, [checkoutOperation, setListeners])

  return { checkoutOperation, checkoutOperationReactiveState }
}

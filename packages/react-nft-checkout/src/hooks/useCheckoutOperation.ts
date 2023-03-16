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
  selectedChain?: BridgeChain
  targetNft?: Target
}

export const useCheckoutOperation = ({
  provider,
  createCheckoutOperationParams,
  selectedChain,
  targetNft,
}: Props) => {
  const [checkoutOperation, setCheckoutOperation] =
    useState<INFTCheckoutOperation | null>(null)
  const [checkoutOperationReactiveState, setCheckoutOperationReactiveState] =
    useState(() => {
      return {
        isInitiated: checkoutOperation?.isInitialized,
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
    if (!checkoutOperation || !targetNft || !selectedChain) return

    const init = async () => {
      await checkoutOperation.init({
        chainIdFrom: selectedChain.id,
        target: targetNft,
      })
    }

    init()
  }, [checkoutOperation, selectedChain, targetNft])

  useEffect(() => {
    setListeners()

    return () => {
      checkoutOperation?.clearHandlers()
    }
  }, [checkoutOperation, setListeners])

  return { checkoutOperation, checkoutOperationReactiveState }
}

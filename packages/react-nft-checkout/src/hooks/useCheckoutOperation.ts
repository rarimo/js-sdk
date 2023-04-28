import {
  BridgeChain,
  createCheckoutOperation,
  CreateCheckoutOperationParams,
  EVMOperation,
  INFTCheckoutOperation,
  Target,
  Token,
} from '@rarimo/nft-checkout'
import type { IProvider } from '@rarimo/provider'
import { useCallback, useEffect, useState } from 'react'

type Props = {
  provider: IProvider | null
  createCheckoutOperationParams?: CreateCheckoutOperationParams
  selectedChain?: BridgeChain
  targetNft?: Target
  selectedSwapToken?: Token
}

export const useCheckoutOperation = ({
  provider,
  createCheckoutOperationParams,
  selectedChain,
  targetNft,
  selectedSwapToken,
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
        target: {
          ...targetNft,
          swapTargetTokenSymbol: selectedSwapToken?.symbol ?? 'WETH',
        },
      })
    }

    init()
  }, [checkoutOperation, selectedChain, targetNft, selectedSwapToken])

  useEffect(() => {
    setListeners()

    return () => {
      checkoutOperation?.clearHandlers()
    }
  }, [checkoutOperation, setListeners])

  return { checkoutOperation, checkoutOperationReactiveState }
}

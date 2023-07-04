import type { Token } from '@rarimo/bridge'
import type {
  CheckoutOperation,
  CheckoutOperationParams,
} from '@rarimo/nft-checkout'
import {
  createCheckoutOperation,
  EVMOperation,
  Price,
} from '@rarimo/nft-checkout'
import type { IProvider } from '@rarimo/provider'
import type { BridgeChain } from '@rarimo/shared'
import { useCallback, useEffect, useState } from 'react'

type Props = {
  provider: IProvider | null
  selectedChain?: BridgeChain
  params?: CheckoutOperationParams
  selectedSwapToken?: Token
}

export const useCheckoutOperation = ({
  provider,
  selectedChain,
  params,
  selectedSwapToken,
}: Props) => {
  const [checkoutOperation, setCheckoutOperation] =
    useState<CheckoutOperation | null>(null)
  const [checkoutOperationReactiveState, setCheckoutOperationReactiveState] =
    useState(() => {
      return {
        isInitiated: checkoutOperation?.isInitialized,
        chainFrom: checkoutOperation?.chainFrom,
        status: checkoutOperation?.status,
      }
    })

  const setListeners = useCallback(() => {
    if (!checkoutOperation) return

    checkoutOperation.onInitiated(payload => {
      const { isInitiated, chainFrom } = payload ?? {}

      setCheckoutOperationReactiveState(prev => ({
        ...prev,
        chainFrom,
        isInitiated,
      }))
    })

    checkoutOperation.onStatusChanged(payload => {
      setCheckoutOperationReactiveState(prev => ({
        ...prev,
        status: payload?.status,
      }))
    })
  }, [checkoutOperation])

  useEffect(() => {
    if (!provider || !params || !selectedChain) return
    const init = async () => {
      const op = await createCheckoutOperation(EVMOperation, provider!, {
        ...params,
        chainIdFrom: selectedChain.id,
        price: Price.fromBigInt(
          params.price.value,
          params.price.decimals,
          selectedSwapToken?.symbol ?? 'ETH',
        ),
      })
      setCheckoutOperation(op)
    }
    init()
  }, [provider, checkoutOperation, selectedChain, params, selectedSwapToken])

  useEffect(() => {
    setListeners()

    return () => {
      checkoutOperation?.clearHandlers()
    }
  }, [checkoutOperation, setListeners])

  return { checkoutOperation, checkoutOperationReactiveState }
}

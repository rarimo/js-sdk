import type { Token } from '@rarimo/bridge'
import {
  CheckoutOperation,
  CheckoutOperationParams,
  createCheckoutOperation,
  CreateCheckoutOperationParams,
  EVMOperation,
  Price,
} from '@rarimo/nft-checkout'
import type { IProvider } from '@rarimo/provider'
import type { BridgeChain } from '@rarimo/shared'
import { useCallback, useEffect, useState } from 'react'

type Props = {
  provider: IProvider | null
  createCheckoutOperationParams?: CreateCheckoutOperationParams
  selectedChain?: BridgeChain
  params?: CheckoutOperationParams
  selectedSwapToken?: Token
}

export const useCheckoutOperation = ({
  provider,
  createCheckoutOperationParams,
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
    if (!provider) return

    const op = createCheckoutOperation(
      EVMOperation,
      provider,
      createCheckoutOperationParams,
    )
    setCheckoutOperation(op)
  }, [createCheckoutOperationParams, provider])

  useEffect(() => {
    if (!checkoutOperation || !params || !selectedChain) return
    const init = async () => {
      await checkoutOperation.init({
        ...params,
        chainIdFrom: selectedChain.id,
        // FIXME: not sure that it will work correctly
        price: Price.fromBigInt(
          params.price.value,
          params.price.decimals,
          selectedSwapToken?.symbol ?? 'WETH',
        ),
      })
    }

    init()
  }, [checkoutOperation, selectedChain, params, selectedSwapToken])

  useEffect(() => {
    setListeners()

    return () => {
      checkoutOperation?.clearHandlers()
    }
  }, [checkoutOperation, setListeners])

  return { checkoutOperation, checkoutOperationReactiveState }
}

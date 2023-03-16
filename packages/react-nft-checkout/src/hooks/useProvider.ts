import {
  createProvider,
  CreateProviderOpts,
  EthProviderRpcError,
  IProvider,
  ProviderChainChangedEventPayload,
  ProviderConnectRelatedEventPayload,
  ProviderInitiatedEventPayload,
  ProviderProxyConstructor,
} from '@rarimo/provider'
import { useCallback, useEffect, useState } from 'react'

const PROVIDER_EVENTS: Array<keyof IProvider> = [
  'onInitiated',
  'onConnect',
  'onAccountChanged',
  'onChainChanged',
  'onDisconnect',
]

type ProviderEventPayload =
  | ProviderConnectRelatedEventPayload
  | ProviderChainChangedEventPayload
  | ProviderInitiatedEventPayload

export const useProvider = (
  providerProxy?: ProviderProxyConstructor,
  createProviderOpts?: CreateProviderOpts,
) => {
  const [provider, setProvider] = useState<IProvider | null>(null)
  const [providerReactiveState, setProviderReactiveState] = useState(() => {
    return {
      isConnected: provider?.isConnected,
      providerType: provider?.providerType,
      chainId: provider?.chainId,
      chainType: provider?.chainType,
      address: provider?.address,
    }
  })
  const [createProviderError, setCreateProviderError] = useState('')

  const setListeners = useCallback(() => {
    if (!provider) return

    PROVIDER_EVENTS.forEach(event => {
      const providerEvent = provider[event] as (
        cb: (payload: ProviderEventPayload) => void,
      ) => void

      providerEvent?.call(provider, payload => {
        setProviderReactiveState(prev => ({
          ...prev,
          ...payload,
        }))
      })
    })
  }, [provider])

  useEffect(() => {
    if (!providerProxy) return

    const initProvider = async () => {
      try {
        setCreateProviderError('')
        const initedProvider = await createProvider(
          providerProxy,
          createProviderOpts,
        )
        setProvider(initedProvider)
      } catch (error) {
        setCreateProviderError(
          (error as unknown as EthProviderRpcError)?.message,
        )
      }
    }

    initProvider()
  }, [providerProxy, createProviderOpts])

  useEffect(() => {
    provider?.clearHandlers()
    setListeners()
    provider?.connect()

    return () => {
      provider?.clearHandlers()
    }
  }, [provider, setListeners])

  return { provider, providerReactiveState, createProviderError }
}

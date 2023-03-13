import {
  createProvider,
  CreateProviderOpts,
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
  providerProxy: ProviderProxyConstructor,
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
      connect: provider?.connect,
      addChain: provider?.addChain,
      switchChain: provider?.switchChain,
      signAndSendTx: provider?.signAndSendTx,
      signMessage: provider?.signMessage,
      getHashFromTx: provider?.getHashFromTx,
      getTxUrl: provider?.getTxUrl,
      getAddressUrl: provider?.getAddressUrl,
      getWeb3Provider: provider?.getWeb3Provider,
    }
  })

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
    const initProvider = async () => {
      const initedProvider = await createProvider(
        providerProxy,
        createProviderOpts,
      )
      setProvider(initedProvider)
    }

    initProvider()
  }, [providerProxy, createProviderOpts])

  useEffect(() => {
    setListeners()

    return () => {
      provider?.clearHandlers()
    }
  }, [provider, setListeners])

  return {
    provider,
    ...providerReactiveState,
  }
}

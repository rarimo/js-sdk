import {
  createProvider,
  CreateProviderOpts,
  IProvider,
  ProviderProxyConstructor,
} from '@rarimo/provider'
import { useCallback, useEffect, useState } from 'react'

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
    }
  })

  const setListeners = useCallback(() => {
    if (!provider) return

    provider.onInitiated(({ address, isConnected, chainId }) => {
      setProviderReactiveState(prev => ({
        ...prev,
        address,
        isConnected,
        chainId,
      }))
    })
    provider.onConnect(({ address, isConnected }) => {
      setProviderReactiveState(prev => ({
        ...prev,
        address,
        isConnected,
      }))
    })
    provider.onAccountChanged(({ isConnected, address }) => {
      setProviderReactiveState(prev => ({
        ...prev,
        address,
        isConnected,
      }))
    })
    provider.onChainChanged?.(({ chainId }) => {
      setProviderReactiveState(prev => ({
        ...prev,
        chainId,
      }))
    })
    provider.onDisconnect(({ isConnected, address }) => {
      setProviderReactiveState(prev => ({
        ...prev,
        address,
        isConnected,
      }))
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

  return { provider, providerReactiveState }
}

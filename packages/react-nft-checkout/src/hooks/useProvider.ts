import {
  createProvider,
  CreateProviderOpts,
  Provider,
  ProviderProxyConstructor,
} from '@rarimo/provider'
import { useEffect, useState } from 'react'

import { useForceUpdate } from './useForceUpdate'

export const useProvider = (
  providerProxy: ProviderProxyConstructor,
  createProviderOpts?: CreateProviderOpts,
) => {
  const forceUpdate = useForceUpdate()
  const [provider, setProvider] = useState<Provider | null>(null)

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
    forceUpdate()
  }, [
    provider?.address,
    provider?.chainId,
    provider?.chainType,
    provider?.isConnected,
    provider?.providerType,
  ])

  return provider
}

import type { IProvider } from '@rarimo/provider'
import { errors as providerErrors } from '@rarimo/provider'
import type { BridgeChain } from '@rarimo/shared'

export const handleCorrectProviderChain = async (
  provider: IProvider,
  chain?: BridgeChain,
  chainFrom?: BridgeChain,
) => {
  if (!provider.isConnected) {
    await provider.connect()
  }

  if (provider.chainId != chain?.id) {
    await switchChain(provider, chain, chainFrom)
  }
}

const switchChain = async (
  provider: IProvider,
  chain?: BridgeChain,
  chainFrom?: BridgeChain,
) => {
  const targetChain = chain ?? chainFrom

  try {
    await provider.switchChain(targetChain!.id)
  } catch (e) {
    if (!(e instanceof providerErrors.ProviderChainNotFoundError)) {
      throw e
    }
    await provider.addChain!(targetChain!)
    await switchChain(provider, targetChain)
  }
}

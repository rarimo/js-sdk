import type { IProvider } from '@rarimo/provider'
import { errors as providerErrors } from '@rarimo/provider'
import type { BridgeChain } from '@rarimo/shared'

export const handleCorrectProviderChain = async (
  provider: IProvider,
  chainFrom: BridgeChain,
) => {
  if (!provider.isConnected) await provider.connect()
  if (provider.chainId != chainFrom.id) await switchChain(provider, chainFrom)
}

const switchChain = async (provider: IProvider, chainFrom: BridgeChain) => {
  try {
    await provider.switchChain(chainFrom.id)
  } catch (e) {
    if (!(e instanceof providerErrors.ProviderChainNotFoundError)) throw e
    await provider.addChain!(chainFrom)
    await switchChain(provider, chainFrom)
  }
}

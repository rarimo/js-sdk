import { ProviderProxy, Providers, RawProvider } from '@rarimo/provider'

import { BaseEVMProvider } from './base-evm'

/**
 * @description Represents a Metamask wallet.
 *
 * @example
 * ```js
 * import { createProvider } from '@rarimo/provider'
 * import { MetamaskProvider } from '@rarimo/providers-evm'
 *
 * const getMetamaskWalletAddress = async () => {
 *   // Connect to the Metamask wallet in the browser, using the MetamaskProvider interface to limit bundle size.
 *   const provider = await createProvider(MetamaskProvider)
 *   await provider.connect()
 *
 *   // Get the address of the wallet
 *   console.log(provider.address)
 * }
 * ```
 */
export class MetamaskProvider extends BaseEVMProvider implements ProviderProxy {
  constructor(provider?: RawProvider) {
    super(provider)
  }

  static get providerType(): Providers {
    return Providers.Metamask
  }
}
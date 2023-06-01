import type { ProviderProxy, RawProvider } from '@rarimo/provider'
import { Providers } from '@rarimo/provider'

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
  /**
   * @description In most cases, instead of using this constructor, pass the MetamaskProvider class to {@link @rarimo/provider!createProvider}.
   */
  constructor(provider?: RawProvider) {
    super(provider)
  }

  static get providerType(): Providers {
    return Providers.Metamask
  }
}

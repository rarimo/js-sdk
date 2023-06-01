import type { ProviderProxy, RawProvider } from '@rarimo/provider'
import { Providers } from '@rarimo/provider'

import { BaseEVMProvider } from './base-evm'

/**
 * @description Represents a Coinbase wallet.
 *
 * @example
 * ```js
 * import { createProvider } from '@rarimo/provider'
 * import { CoinbaseProvider } from '@rarimo/providers-evm'
 *
 * const getCoinbaseWalletAddress = async () => {
 *   // Connect to the Coinbase wallet in the browser, using the CoinbaseProvider interface to limit bundle size.
 *   const provider = await createProvider(CoinbaseProvider)
 *   await provider.connect()
 *
 *   // Get the address of the wallet
 *   console.log(provider.address)
 * }
 * ```
 */
export class CoinbaseProvider extends BaseEVMProvider implements ProviderProxy {
  /**
   * @description In most cases, instead of using this constructor, pass the CoinbaseProvider class to {@link @rarimo/provider!createProvider}.
   */
  constructor(provider?: RawProvider) {
    super(provider)
  }

  static get providerType(): Providers {
    return Providers.Coinbase
  }
}

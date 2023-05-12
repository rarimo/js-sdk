import { ProviderProxy, Providers, RawProvider } from '@rarimo/provider'

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
  constructor(provider?: RawProvider) {
    super(provider)
  }

  static get providerType(): Providers {
    return Providers.Coinbase
  }
}

import { ProviderProxy, RawProvider } from '../types'
import { BaseEVMProvider } from './base-evm'
import { Providers } from '../enums'

/**
 * @description Represents a Coinbase wallet.
 *
 * @example
 * ```js
 * import { createProvider, CoinbaseProvider } from '@rarimo/provider'
 *
 * const getCoinbaseBalances = async () => {
 *   // Connect to the Coinbase wallet in the browser using Web3.js, using the CoinbaseProvider interface to limit bundle size.
 *   const provider = await createProvider(CoinbaseProvider)
 *   await provider.connect()
 *
 *   // Get the address of the wallet
 *   console.log(provider.address)
 * }
 * ```
 */
export class CoinbaseProvider extends BaseEVMProvider implements ProviderProxy {
  constructor(provider: RawProvider) {
    super(provider)
  }

  static get providerType(): Providers {
    return Providers.Coinbase
  }
}

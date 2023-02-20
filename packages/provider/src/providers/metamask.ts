import { ProviderProxy, RawProvider } from '../types'
import { BaseEVMProvider } from './base-evm'
import { Providers } from '../enums'

/**
 * @description Represents a Metamask wallet.
 *
 * @example
 * ```js
 * import { createProvider, MetamaskProvider } from '@rarimo/provider'
 *
 * const getMetamaskBalances = async () => {
 *   // Connect to the Metamask wallet in the browser using Web3.js, using the MetamaskProvider interface to limit bundle size.
 *   const provider = await createProvider(MetamaskProvider)
 *
 *   // Get the address of the wallet
 *   console.log(provider.address)
 * }
 * ```
 */
export class MetamaskProvider extends BaseEVMProvider implements ProviderProxy {
  constructor(provider: RawProvider) {
    super(provider)
  }

  static get providerType(): Providers {
    return Providers.Metamask
  }
}

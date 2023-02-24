import { ProviderProxy, RawProvider } from '../types'
import { BaseEVMProvider } from './base-evm'
import { Providers } from '../enums'

export class CoinbaseProvider extends BaseEVMProvider implements ProviderProxy {
  constructor(provider: RawProvider) {
    super(provider)
  }

  static get providerType(): Providers {
    return Providers.Coinbase
  }
}

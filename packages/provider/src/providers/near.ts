import { ProviderProxy, RawProvider } from '../types'
import { Providers } from '../enums'
import { BaseNear } from './base-near'

export class NearProvider extends BaseNear implements ProviderProxy {
  constructor(provider: RawProvider) {
    super(provider)
  }

  static get providerType(): Providers {
    return Providers.Near
  }
}

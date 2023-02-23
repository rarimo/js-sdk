import { ProviderProxy, RawProvider } from '../types'
import { BaseEthereumProvider } from './baseEthereum'
import { Providers } from '../enums'

export class MetamaskProvider
  extends BaseEthereumProvider
  implements ProviderProxy
{
  constructor(provider: RawProvider) {
    super(provider)
  }

  static get providerType(): Providers {
    return Providers.Metamask
  }
}

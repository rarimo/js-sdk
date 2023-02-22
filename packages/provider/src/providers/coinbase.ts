import { ProviderProxy, RawProvider } from '@/types'
import { BaseEthereumProvider } from '@/providers/baseEthereum'
import { Providers } from '@/enums'

export class CoinbaseProvider
  extends BaseEthereumProvider
  implements ProviderProxy
{
  constructor(provider: RawProvider) {
    super(provider)
  }

  static get providerType(): Providers {
    return Providers.Coinbase
  }
}

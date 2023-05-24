import type { ProviderProxy } from '@rarimo/provider'
import type { providers } from 'ethers'

import { BaseEVMProvider } from '@/base-evm'

export class EthersProvider extends BaseEVMProvider implements ProviderProxy {
  constructor(provider?: providers.Web3Provider) {
    super(provider)
  }
}

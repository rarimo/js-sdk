import type { Chain, ChainId, ChainTypes } from '@rarimo/shared'
import type { providers } from 'ethers'

import type { Providers } from '@/enums'

import type { EthereumProvider } from './eth'
import type { ProviderSubscriber } from './provider-event-bus'
import type { SolanaProvider } from './solana'
import type { TransactionRequestBody, TransactionResponse } from './tx'

export type RawProvider =
  | EthereumProvider
  | SolanaProvider
  | providers.Web3Provider

export type ProviderInstance = {
  name: Providers
  instance?: RawProvider
}

export interface ProviderProxyConstructor {
  new (provider?: RawProvider): ProviderProxy
  providerType: Providers
}

export interface ProviderBase {
  chainId?: ChainId
  chainType?: ChainTypes
  address?: string
  isConnected: boolean

  connect: () => Promise<void>

  addChain?: (chain: Chain) => Promise<void>
  switchChain: (chainId: ChainId) => Promise<void>

  signAndSendTx: (
    txRequestBody: TransactionRequestBody,
  ) => Promise<TransactionResponse>
  signMessage?: (message: string) => Promise<string>

  getHashFromTx?: (txResponse: TransactionResponse) => string
  getTxUrl?: (chain: Chain, txHash: string) => string
  getAddressUrl?: (chain: Chain, address: string) => string

  // EVM specific methods
  getWeb3Provider?: () => providers.Web3Provider
}

export interface ProviderProxy extends ProviderBase, ProviderSubscriber {
  init: () => Promise<void>
}

export interface IProvider extends ProviderBase, ProviderSubscriber {
  providerType?: Providers
  init: (provider: ProviderInstance) => Promise<this>
}

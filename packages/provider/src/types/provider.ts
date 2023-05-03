import type { TransactionRequest } from '@ethersproject/abstract-provider'
import type { Deferrable } from '@ethersproject/properties'
import type { Chain, ChainId, ChainTypes } from '@rarimo/core'
import type {
  Transaction as SolTransaction,
  TransactionSignature,
} from '@solana/web3.js'
import type { providers } from 'ethers'
import type { providers as nearProviders } from 'near-api-js'
import type { TransactionConfig } from 'web3-core'

import type { Providers } from '@/enums'

import type { EthereumProvider } from './ethereum'
import type { NearProviderType } from './near'
import type { ProviderSubscriber } from './provider-event-bus'
import type { SolanaProvider } from './solana'

export type RawProvider = EthereumProvider | SolanaProvider | NearProviderType

export type ProviderInstance = {
  name: Providers
  instance?: RawProvider
}

export type TxRequestBody =
  | Deferrable<TransactionRequest>
  | SolTransaction
  | string

export type EthTransactionResponse = providers.TransactionReceipt

export type EthereumTransaction = TransactionConfig

export type SolanaTransactionResponse = TransactionSignature

export type NearTransactionResponse = nearProviders.FinalExecutionOutcome

export type TransactionResponse =
  | EthTransactionResponse
  | SolanaTransactionResponse
  | NearTransactionResponse

export interface ProviderProxyConstructor {
  new (provider: RawProvider): ProviderProxy
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

  signAndSendTx: (txRequestBody: TxRequestBody) => Promise<TransactionResponse>
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

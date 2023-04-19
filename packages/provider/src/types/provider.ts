import { TransactionRequest } from '@ethersproject/abstract-provider'
import { Deferrable } from '@ethersproject/properties'
import {
  Transaction as SolTransaction,
  TransactionSignature,
} from '@solana/web3.js'
import { ethers, providers } from 'ethers'
import { providers as nearProviders } from 'near-api-js'
import { TransactionConfig } from 'web3-core'

import { ChainTypes, Providers } from '@/enums'

import { Chain, ChainId } from './chain'
import { EthereumProvider } from './ethereum'
import { NearProviderType, NearTxRequestBody } from './near'
import { ProviderSubscriber } from './provider-event-bus'
import { SolanaProvider } from './solana'

export type RawProvider = EthereumProvider | SolanaProvider | NearProviderType

export type ProviderInstance = {
  name: Providers
  instance?: RawProvider
}

export type TxRequestBody =
  | Deferrable<TransactionRequest>
  | SolTransaction
  | NearTxRequestBody
  | string

export type EthTransactionResponse = ethers.providers.TransactionReceipt

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

  // Near specific method
  signAndSendTxs?: (
    txRequestBodies: TxRequestBody[],
  ) => Promise<TransactionResponse[]>

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

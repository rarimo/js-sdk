import { TransactionRequest } from '@ethersproject/abstract-provider'
import { Deferrable } from '@ethersproject/properties'
import {
  Transaction as SolTransaction,
  TransactionSignature,
} from '@solana/web3.js'
import { ethers } from 'ethers'

import { ChainTypes, Providers } from '@/enums'
import { EthereumProvider } from './ethereum'
import { TransactionConfig } from 'web3-core'
import { PhantomProvider } from './solana'
import { Chain, ChainId } from '@/types/chain'

export type RawProvider = EthereumProvider | PhantomProvider

export type ProviderInstance = {
  name: Providers
  instance: RawProvider
}

export type TxRequestBody =
  | Deferrable<TransactionRequest>
  | SolTransaction
  | string

export type EthTransactionResponse = ethers.providers.TransactionReceipt

export type EthereumTransaction = TransactionConfig

export type SolanaTransactionResponse = TransactionSignature

export type TransactionResponse =
  | EthTransactionResponse
  | SolanaTransactionResponse

export interface ProviderProxyConstructor {
  new (provider: RawProvider): ProviderProxy
  providerType: Providers
}

interface ProviderBase {
  chainId?: ChainId
  chainType?: ChainTypes
  address?: string
  isConnected: boolean

  connect: () => Promise<void>
  disconnect?: () => Promise<void>

  addChain?: (chain: Chain) => Promise<void>
  switchChain: (chainId: ChainId) => Promise<void>

  signAndSendTx: (txRequestBody: TxRequestBody) => Promise<TransactionResponse>
  signMessage?: (message: string) => Promise<string>

  getHashFromTx?: (txResponse: TransactionResponse) => string
  getTxUrl?: (chain: Chain, txHash: string) => string
  getAddressUrl?: (chain: Chain, address: string) => string
}

export interface ProviderProxy extends ProviderBase {
  init: () => Promise<void>
}

export interface IProvider extends ProviderBase {
  providerType?: Providers
  init: (provider: ProviderInstance) => Promise<this>
}

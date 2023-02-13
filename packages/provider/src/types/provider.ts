import { TransactionRequest } from '@ethersproject/abstract-provider'
import { Deferrable } from '@ethersproject/properties'
import {
  Transaction as SolTransaction,
  TransactionSignature,
} from '@solana/web3.js'
import { ethers } from 'ethers'

import { ChainTypes, Providers } from '@/enums'
import { EthereumProvider } from './ethereum'
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

export type SolanaTransactionResponse = TransactionSignature

export type TransactionResponse =
  | EthTransactionResponse
  | SolanaTransactionResponse

export interface ProviderProxyConstructor {
  new (provider: RawProvider): ProviderProxy
}

interface ProviderBase {
  provider?: ethers.providers.Web3Provider
  signer?: ethers.providers.JsonRpcSigner

  chainId?: ChainId
  address?: string
  isConnected: boolean

  connect: () => Promise<void>
  disconnect?: () => Promise<void>

  addChain?: (chain: Chain) => Promise<void>
  switchChain: (chainId: ChainId) => Promise<void>

  signAndSendTx: (txRequestBody: TxRequestBody) => Promise<TransactionResponse>
  signMessage?: (message: string) => Promise<string | undefined>

  getHashFromTx: (txResponse: TransactionResponse) => string
  getTxUrl: (explorerUrl: string, txHash: string) => string
  getAddressUrl: (explorerUrl: string, address: string) => string
}

export interface ProviderProxy extends ProviderBase {
  init: () => Promise<void>
}

export interface IProvider extends ProviderBase {
  providerType?: Providers
  chainType: ChainTypes
  init: (provider: ProviderInstance) => Promise<IProvider>
}

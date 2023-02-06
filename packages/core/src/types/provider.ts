import { TransactionRequest } from '@ethersproject/abstract-provider'
import { Deferrable } from '@ethersproject/properties'
import {
  Transaction as SolTransaction,
  TransactionSignature,
} from '@solana/web3.js'
import { ethers } from 'ethers'

import { Providers } from '@/enums'
import { EthereumProvider } from './ethereum'
import { PhantomProvider } from './solana'

export type RawProvider = EthereumProvider | PhantomProvider

export type ProviderInstance = {
  name: Providers
  instance: RawProvider
}

export type ChainId = string | number

export type Chain = {
  id: ChainId
  name: string
  rpcUrl: string
}

export type TxRequestBody =
  | Deferrable<TransactionRequest>
  | SolTransaction
  | string
  | unknown

export type EthTransactionResponse = ethers.providers.TransactionReceipt

export type SolanaTransactionResponse = TransactionSignature

export type TransactionResponse =
  | EthTransactionResponse
  | SolanaTransactionResponse
  | unknown

export interface ProviderProxyConstructor {
  new (provider: RawProvider): ProviderProxy
}

export interface ProviderProxy {
  currentProvider?: ethers.providers.Web3Provider
  currentSigner?: ethers.providers.JsonRpcSigner

  chainId: ChainId
  selectedAddress: string
  isConnected: boolean

  init: () => Promise<void>
  connect: () => Promise<void>
  switchChain: (chainId: ChainId) => Promise<void>
  addChain?: (
    chainId: ChainId,
    chainName: string,
    chainRpcUrl: string,
  ) => Promise<void>
  signAndSendTransaction: (
    txRequestBody: TxRequestBody,
  ) => Promise<TransactionResponse>
  getHashFromTxResponse: (txResponse: TransactionResponse) => string
  getTxUrl: (explorerUrl: string, txHash: string) => string
  getAddressUrl: (explorerUrl: string, address: string) => string
  disconnect?: () => Promise<void>
  signMessage?: (message: string) => Promise<string | undefined>
}

export interface IProvider {
  currentProvider: ethers.providers.Web3Provider | undefined
  currentSigner: ethers.providers.JsonRpcSigner | undefined

  selectedProvider?: Providers
  chainId?: ChainId
  selectedAddress?: string
  isConnected: boolean

  init: (provider: ProviderInstance) => Promise<IProvider>
  connect: () => Promise<void>
  disconnect: () => Promise<void>
  switchChain: (chainId: ChainId) => Promise<void>
  addChain: (
    chainId: ChainId,
    chainName: string,
    chainRpcUrl: string,
  ) => Promise<void>
  signAndSendTx: (txRequestBody: TxRequestBody) => Promise<TransactionResponse>
  getHashFromTxResponse: (txResponse: TransactionResponse) => string
  getTxUrl: (explorerUrl: string, txHash: string) => string
  getAddressUrl: (explorerUrl: string, address: string) => string
  signMessage: (message: string) => Promise<string | undefined>
}

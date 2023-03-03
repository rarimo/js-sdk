import { Transaction } from '@solana/web3.js'
import { TransactionResponse, TxRequestBody } from './provider'
import { Wallet, WalletSelector } from '@near-wallet-selector/core'

export enum ENearWalletId {
  MyNearWallet = 'my-near-wallet',
}

export type NearTxRequestBody = {
  contractId: string
  method: string
  args?: Record<string, unknown>
  gas?: string
  deposit?: string
}

export type NearProviderType = {
  selector: WalletSelector | null
  wallet: Wallet | null
  createAccessKeyFor: string
  accountId: string
  init: () => Promise<void>
  signIn: () => Promise<void>
  signOut: () => Promise<void>
  isConnected: boolean | null
  signTransaction: (transaction: Transaction) => Promise<Transaction>
  signAllTransactions: (transactions: Transaction[]) => Promise<Transaction[]>
  signAndSendTx(
    txRequestBody: TxRequestBody | NearTxRequestBody,
  ): Promise<TransactionResponse>
  getHashFromTxResponse(txResponse: TransactionResponse): string
  connect: () => Promise<void>
}

export type NearProviderRpcError = {
  name: string
  cause: {
    info: unknown
    name: string
  }
  code: number
  data: unknown
  message: string
}

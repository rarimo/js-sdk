import type { TransactionRequest } from '@ethersproject/abstract-provider'
import type { Deferrable } from '@ethersproject/properties'
import type {
  Transaction as SolanaTransactionRequestBody,
  TransactionSignature,
} from '@solana/web3.js'
import type { providers } from 'ethers'
import type { providers as nearProviders } from 'near-api-js/lib/common-index'

export type NearTransactionRequestBody = {
  contractId: string
  method: string
  args?: Record<string, unknown>
  gas?: string
  deposit?: string
}

export type TransactionRequestBody =
  | Deferrable<TransactionRequest>
  | SolanaTransactionRequestBody
  | NearTransactionRequestBody
  | string

export type EthereumTransactionResponse = providers.TransactionReceipt

export type SolanaTransactionResponse = TransactionSignature

export type NearTransactionResponse = nearProviders.FinalExecutionOutcome

export type TransactionResponse =
  | EthereumTransactionResponse
  | SolanaTransactionResponse
  | NearTransactionResponse

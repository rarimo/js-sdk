import type { DestinationTransaction } from '@rarimo/bridge'
import type { IProvider } from '@rarimo/provider'
import type {
  Address,
  BridgeChain,
  Chain,
  ChainId,
  TransactionBundle,
} from '@rarimo/shared'

import type { Price } from '@/entities'

import type { Config } from './config'
import type { OperationSubscriber } from './operation-event-bus'
import type { EstimatedPrice, PaymentToken } from './token'

export enum CheckoutOperationStatus {
  Created,
  Initializing,
  SupportedChainsLoading,
  SupportedChainsLoaded,
  Initialized,
  PaymentTokensLoading,
  PaymentTokensLoaded,
  EstimatedPriceCalculating,
  EstimatedPriceCalculated,
  CheckoutStarted,
  CheckAllowance,
  Approve,
  Approved,
  SubmittingCheckoutTx,
  CheckoutCompleted,
  DestinationTxPending,
  DestinationTxSuccess,
  DestinationTxFailed,
}

export type CheckoutOperationParams = {
  chainIdTo: ChainId
  chainIdFrom: ChainId
  price: Price
  recipient?: Address
  slippage?: number // 0.5, 1, 5, 10 etc
}

export interface CheckoutOperationConstructor {
  new (config: Config, provider: IProvider): CheckoutOperation
}

export interface CheckoutOperation extends OperationSubscriber {
  chainFrom: Chain | undefined
  provider: IProvider
  isInitialized: boolean
  status: CheckoutOperationStatus

  /**
   * Initialize the operation with the source chain and transaction parameters
   * @param args Information about the source chain and the target transaction of the operation
   */
  init(args: CheckoutOperationParams): Promise<void>
  /**
   * Get the chains that are supported for the operation type
   *
   * @returns A list of supported chains and information about them
   */
  supportedChains(): Promise<BridgeChain[]>
  /**
   * Load the wallet's balance of payment tokens on the specified chain.
   *
   * @param chain A chain from {@link supportedChains}
   * @returns An array of tokens and the wallet's balance of each token
   */
  loadPaymentTokens(chain: BridgeChain): Promise<PaymentToken[]>
  /**
   * Get the estimated purchase price in the payment token, including the cost to swap the tokens to the tokens that the seller accepts payment in
   *
   * @param from The token to use for the transaction
   * @returns Information about the costs involved in the transaction, including the gas price
   */
  estimatePrice(from: PaymentToken): Promise<EstimatedPrice>
  /**
   * Send a transaction to Rarimo for processing
   *
   * @param e The estimated price of the transaction, from {@link estimatePrice}
   * @param {TransactionBundle} [bundle] The transaction bundle
   * @returns The hash of the transaction
   */
  checkout(e: EstimatedPrice, bundle?: TransactionBundle): Promise<string>
  /**
   * Get the destination chain transaction hash as the result of the bridging
   *
   * @returns Destination transaction hash and transaction status
   */
  getDestinationTx(
    sourceChain: BridgeChain,
    sourceTxHash: string,
  ): Promise<DestinationTransaction>
}

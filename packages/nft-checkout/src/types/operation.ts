import type { IProvider } from '@rarimo/provider'
import type {
  Address,
  BridgeChain,
  Chain,
  ChainId,
  DestinationTransaction,
  TransactionBundle,
} from '@rarimo/shared'

import type { Price } from '@/entities'
import { CheckoutOperationStatus } from '@/enums'

import type { OperationSubscriber } from './operation-event-bus'
import type { EstimatedPrice, PaymentToken } from './token'

export type CheckoutOperationParams = {
  chainIdTo: ChainId
  chainIdFrom: ChainId
  price: Price
  recipient?: Address
  slippage?: number // 0.5, 1, 5, 10 etc
}

export type CheckoutOperationCreateFunction = (
  provider: IProvider,
) => CheckoutOperation

export interface CheckoutOperation extends OperationSubscriber {
  chainFrom: Chain | undefined
  provider: IProvider
  isInitialized: boolean
  status: CheckoutOperationStatus

  /**
   * Initialize the operation with the source chain and transaction parameters
   * @param args - Information about the source chain and the target transaction of the operation
   */
  init(args: CheckoutOperationParams): Promise<void>
  /**
   * Get the chains that are supported for the operation type
   *
   * @returns A list of supported chains and information about them
   */
  loadSupportedChains(): Promise<BridgeChain[]>
  /**
   * Load the wallet's balance of payment tokens on the specified chain.
   *
   * @param chain - A chain from {@link supportedChains}
   * @param isMultiplePayment - is multiple payment enabled, in that case
   * method won't check user balance for the payment token
   * @returns An array of tokens and the wallet's balance of each token
   */
  loadPaymentTokens(
    chain: BridgeChain,
    isMultiplePayment?: boolean,
  ): Promise<PaymentToken[]>
  /**
   * Get the estimated purchase price in the payment token or tokens,
   * including the cost to swap the tokens to the tokens that the seller accepts
   * payment in
   *
   * @param from The payment token or tokens to use for the transaction
   * @returns Information about the costs involved in the transaction,
   * including the gas price. Can throw an error if insufficient funds for the
   * multiple token payment.
   */
  estimatePrice(from: PaymentToken): Promise<EstimatedPrice>
  estimatePrice(fromTokens: PaymentToken[]): Promise<EstimatedPrice[]>
  /**
   * Send a transaction to Rarimo for processing
   *
   * @param e - The estimated price of the transaction, from {@link estimatePrice}
   * @param bundle - The transaction bundle
   * @returns The hash of the transaction
   */
  checkout(e: EstimatedPrice, bundle?: TransactionBundle): Promise<string>
  checkout(e: EstimatedPrice[], bundle?: TransactionBundle): Promise<string>
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

import type { IProvider } from '@rarimo/provider'
import type {
  Address,
  BridgeChain,
  Chain,
  ChainId,
  DestinationTransaction,
  TransactionBundle,
} from '@rarimo/shared'
import { ChainTypes, type HexString } from '@rarimo/shared'

import { Price } from '@/entities'
import { CheckoutOperationStatus } from '@/enums'

import type { PaymentToken, SwapEstimation } from './estimate'
import type { OperationSubscriber } from './operation-event-bus'

/**
 * The parameters for a transaction.
 */
export type CheckoutOperationParams = {
  /** The ID of the destination chain, from {@link getSupportedChains} */
  chainIdTo: ChainId
  /** The ID of the source chain, from {@link getSupportedChains} */
  chainIdFrom: ChainId
  /** The amount of the transaction on the destination chain */
  price: Price
  /** The wallet address of the recipient of the result of the transaction */
  recipient?: Address
  /** The slippage tolerance, as a percentage of the source token amount */
  slippage?: number // 0.5, 1, 5, 10 etc
  /** Whether the transaction accepts a single token as input (false) or multiple tokens (true) */
  isMultiplePayment?: boolean
  /** The address of the relayer to use for the transaction */
  relayer?: {
    [ChainTypes.EVM]: Address
    [ChainTypes.Solana]: Address
    [ChainTypes.Near]: Address
  }
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
   */
  init(params: CheckoutOperationParams): Promise<void>
  /**
   * Get the chains that are supported for the operation type
   *
   * @returns A list of supported chains and information about them
   */
  getSupportedChains(): Promise<BridgeChain[]>
  /**
   * Load the tokens that the wallet has enough of to run the operation.
   *
   * @returns An array of tokens and the wallet's balance of each token
   */
  getPaymentTokens(): Promise<PaymentToken[]>
  /**
   * Get the estimated purchase price in the payment token or tokens,
   * including the cost to swap the tokens to the tokens that the seller accepts
   * payment in.
   *
   * If isMultiplePayment is set to true, the operation starts with the native token
   * for the source chain. If the wallet does not have enough of this token,
   * it continues adding tokens from the wallet until it has enough value to
   * complete the transaction. After the native token, it uses other tokens
   * ordered alphabetically by the address of the contract that manages the token.
   *
   * @param from The payment token or tokens to use for the transaction
   * @returns Information about the costs involved in the transaction,
   * including the gas price. Can throw an error if insufficient funds for the
   * multiple token payment.
   */
  estimatePrice(from: PaymentToken[]): Promise<SwapEstimation[]>
  /**
   * Send a transaction to Rarimo for processing
   *
   * @param estimations - The estimated price of the transaction, from {@link estimatePrice}
   * @param bundle - The transaction bundle
   * @returns The hash of the transaction
   */
  checkout(
    estimations: SwapEstimation[],
    bundle?: TransactionBundle,
  ): Promise<string>
  /**
   * Get the destination chain transaction hash as the result of the bridging
   *
   * @returns Destination transaction hash and transaction status
   */
  getDestinationTx(
    sourceChain: BridgeChain,
    sourceTxHash: string,
  ): Promise<DestinationTransaction>
  getBundlerAddress(salt: HexString): Promise<Address>
}

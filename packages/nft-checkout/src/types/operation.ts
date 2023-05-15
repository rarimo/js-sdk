import type { Chain, ChainId, IProvider } from '@rarimo/provider'

import type { PaymentToken, Price, Token } from '@/entities'
import type { DestinationTransaction } from '@/types/tx'

import type { Address, BridgeChain, HexString, TokenSymbol } from './common'
import type { Config } from './config'
import type { OperationSubscriber } from './operation-event-bus'
import type { EstimatedPrice } from './token'

export enum CheckoutOperationStatus {
  Created,
  Initializing,
  SupportedChainsLoading,
  SupportedChainsLoaded,
  Initialized,
  SupportedTokensLoading,
  SupportedTokensLoaded,
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

export type Target = {
  chainId: ChainId
  price: Price
  swapTargetTokenSymbol: TokenSymbol // WETH, USDT, etc
  recipient?: Address
  slippage?: number // 0.5, 1, 5, 10 etc
}

export type TxBundle = {
  bundle: HexString
  salt?: HexString
}

export interface INFTCheckoutOperationConstructor {
  new (config: Config, provider: IProvider): INFTCheckoutOperation
}

export type OperationCreateParams = { chainIdFrom: ChainId; target: Target }

export interface INFTCheckoutOperation extends OperationSubscriber {
  chainFrom: Chain | undefined
  provider: IProvider
  isInitialized: boolean

  /**
   * Initialize the operation with the source chain and transaction parameters
   * @param args Information about the source chain and the target transaction of the operation
   */
  init(args: OperationCreateParams): Promise<void>
  /**
   * Get the chains that are supported for the operation type
   *
   * @returns A list of supported chains and information about them
   */
  supportedChains(): Promise<BridgeChain[]>
  supportedTokens(chain?: BridgeChain): Promise<Token[]>
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
   * @param bundle The transaction bundle
   * @returns The hash of the transaction
   */
  checkout(e: EstimatedPrice, bundle?: TxBundle): Promise<string>
  getDestinationTx(
    sourceChain: BridgeChain,
    sourceTxHash: string,
  ): Promise<DestinationTransaction>
}

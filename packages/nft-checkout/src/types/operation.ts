import {
  Chain,
  ChainId,
  IProvider,
  TransactionResponse,
} from '@rarimo/provider'
import {
  BridgeChain,
  Config,
  EstimatedPrice,
  PaymentToken,
  Target,
  TxBundle,
} from '../types'
import { OperationSubscriber } from './operation-event-bus'

export interface INFTCheckoutOperationConstructor {
  new (config: Config, provider: IProvider): INFTCheckoutOperation
}

export type OperationCreateParams = { chainIdFrom: ChainId; target: Target }

export interface INFTCheckoutOperation extends OperationSubscriber {
  chainFrom: Chain | undefined
  provider: IProvider
  isInitialized: boolean

  init(args: OperationCreateParams): Promise<void>

  supportedChains(): Promise<BridgeChain[]>

  loadPaymentTokens(chain: BridgeChain): Promise<PaymentToken[]>
  estimatePrice(token: PaymentToken): Promise<EstimatedPrice>
  checkout(e: EstimatedPrice, bundle: TxBundle): Promise<TransactionResponse>
}

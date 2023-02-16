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
} from '@/types'

export interface INFTCheckoutOperationConstructor {
  new (config: Config, provider: IProvider): INFTCheckoutOperation
}

export type OperationCreateParams = { chainIdFrom: ChainId; target: Target }

export interface INFTCheckoutOperation {
  chain: Chain | undefined
  provider: IProvider
  initialized: boolean

  init(args: OperationCreateParams): Promise<void>

  supportedChains(): Promise<BridgeChain[]>

  loadPaymentTokens(chain: BridgeChain): Promise<PaymentToken[]>
  estimatePrice(token: PaymentToken): Promise<EstimatedPrice>
  checkout(e: EstimatedPrice, bundle: TxBundle): Promise<TransactionResponse>
}

import type { DestinationTransaction } from '@rarimo/bridge'
import type { IProvider } from '@rarimo/provider'
import type {
  Address,
  BridgeChain,
  Chain,
  ChainId,
  TokenSymbol,
  TxBundle,
} from '@rarimo/shared'

import type { PaymentToken, Price, Token } from '@/entities'

import type { Config } from './config'
import type { OperationSubscriber } from './operation-event-bus'
import type { EstimatedPrice } from './token'

export type Target = {
  chainId: ChainId
  price: Price
  swapTargetTokenSymbol: TokenSymbol // WETH, USDT, etc
  recipient?: Address
  slippage?: number // 0.5, 1, 5, 10 etc
}

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
  supportedTokens(chain?: BridgeChain): Promise<Token[]>

  loadPaymentTokens(chain: BridgeChain): Promise<PaymentToken[]>
  estimatePrice(token: PaymentToken): Promise<EstimatedPrice>
  checkout(e: EstimatedPrice, bundle?: TxBundle): Promise<string>
  getDestinationTx(
    sourceChain: BridgeChain,
    sourceTxHash: string,
  ): Promise<DestinationTransaction>
}

import {
  Chain,
  ChainId,
  IProvider,
  TransactionResponse,
} from '@rarimo/provider'
import { Address, BridgeChain, HexString, TokenSymbol } from './common'
import { Config } from './config'
import { EstimatedPrice, PaymentToken, Token } from './token'
import { Price } from '@/entities'

export type Target = {
  chainId: ChainId
  address: Address
  recipient: Address
  price: Price
  swapTargetTokenSymbol: TokenSymbol // WETH, USDT, etc
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

export interface INFTCheckoutOperation {
  chain: Chain | undefined
  provider: IProvider
  initialized: boolean

  init(args: OperationCreateParams): Promise<void>

  supportedChains(): Promise<BridgeChain[]>
  supportedTokens(): Promise<Token[]>

  loadPaymentTokens(chain: BridgeChain): Promise<PaymentToken[]>
  estimatePrice(token: PaymentToken): Promise<EstimatedPrice>
  checkout(e: EstimatedPrice, bundle: TxBundle): Promise<TransactionResponse>
}

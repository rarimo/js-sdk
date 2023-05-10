import type { DestinationTransaction, Token } from '@rarimo/bridge'
import type { IProvider, TransactionResponse } from '@rarimo/provider'
import type { Amount, BridgeChain, ChainTypes, TxBundle } from '@rarimo/shared'

export type SwapperCreateFn = (p: IProvider) => Swapper

export interface Swapper {
  provider: IProvider
  chains: BridgeChain[]
  chainType: ChainTypes
  isInitialized: boolean
  init(): Promise<void>
  execute(args: ExecuteArgs): Promise<TransactionResponse>
  getDestinationTx(
    sourceChain: BridgeChain,
    sourceTxHash: string,
  ): Promise<DestinationTransaction>
}

export type ExecuteArgs = {
  from: Token
  to: Token
  amountIn: Amount
  amountOut?: Amount // required if swap is required
  receiver?: string // could be another contract, if empty it will be caller by default
  path?: string | string[] // required if swap is required
  chainTo?: string // required if bridging is required
  bundle?: TxBundle // required if transaction bundling is required
  isWrapped?: boolean // required if bridging is required
}

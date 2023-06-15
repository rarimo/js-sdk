import type { Computed, Raw, Ref } from '@distributedlab/reactivity'
import type { Token } from '@rarimo/bridge'
import type { IProvider, TransactionResponse } from '@rarimo/provider'
import type {
  Amount,
  BridgeChain,
  ChainId,
  ChainTypes,
  DestinationTransaction,
  HexString,
  InternalToken,
  TransactionBundle,
} from '@rarimo/shared'

export type SwapperCreateFn = (p: IProvider) => Swapper

export type Swapper = Raw<{
  provider: Ref<IProvider>
  chains: Computed<BridgeChain[]>
  chainType: ChainTypes
  isInitialized: Ref<boolean>
  init(): Promise<void>
  /**
   * @description Submits a transaction to the swap contract to swap, wrap, unwrap, bridge tokens
   *
   * @param args.from - Input token
   * @param args.to - Output token after swap or wrap\unwrap
   * @param args.amountIn - Amount of input token
   * @param args.amountOut - Amount of output token, required if swap is required
   * @param args.receiver - Could be another contract, if empty it will be caller by default
   * @param args.path - DEX swap token path, required if swap is required
   * @param args.chainTo - Destination chain object, required if bridging is required
   * @param args.bundle: - Transaction bundle {@link https://docs.rarimo.com/docs/overview/bundling},
   * required if transaction bundling is required
   * @param args.isWrapped - Determines does input token is wrapped by the Rarimo bridge
   * (does it should be burned during the deposit), required if bridging is required,
   * @param args.handleAllowance - Does handling of allowance is required,
   * like checking allowance and if it less than input amount - approve tx will be submitted
   *
   * @returns Transaction Response
   */
  execute(args: ExecuteArgs): Promise<TransactionResponse>
  execute(
    args: ExecuteArgs[],
    multiplePaymentOpts: MultiplePaymentOpts,
  ): Promise<TransactionResponse>
  /**
   * Proxy function of {@link Bridger.loadSupportedChains}
   */
  loadSupportedChains(): Promise<BridgeChain[]>
  /**
   * Proxy function of {@link Bridger.getChainById}
   */
  getChainById(id: ChainId): BridgeChain | void
  /**
   * Proxy function of {@link Bridger.getDestinationTx}
   */
  getDestinationTx(
    sourceChain: BridgeChain,
    sourceTxHash: string,
  ): Promise<DestinationTransaction>
  /**
   * Proxy function of {@link Bridger.isApproveRequired}
   */
  isApproveRequired(
    token: Token,
    operator: HexString,
    amount?: Amount,
  ): Promise<boolean>
  /**
   * Proxy function of {@link Bridger.approve}
   */
  approve(
    token: Token,
    operator: HexString,
  ): Promise<TransactionResponse | void>
  /**
   * Proxy function of {@link Bridger.approveIfNeeded}
   */
  approveIfNeeded(
    token: Token,
    operator: HexString,
    amount?: Amount,
  ): Promise<TransactionResponse | void>
  /**
   * Proxy function of {@link Bridger.getInternalTokenMapping}
   */
  getInternalTokenMapping(
    targetTokenSymbol: string,
  ): Promise<InternalToken | void>
}>

export type ExecuteArgs = {
  from: Token
  to: Token
  amountIn: Amount
  amountOut?: Amount
  receiver?: string
  path?: string | string[]
  chainTo?: BridgeChain
  bundle?: TransactionBundle
  isWrapped?: boolean
  handleAllowance?: boolean
}

export type MultiplePaymentOpts = {
  amountOut: Amount
  to: Token
}

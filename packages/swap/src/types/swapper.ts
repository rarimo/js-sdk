import type {
  DestinationTransaction,
  InternalToken,
  Token,
} from '@rarimo/bridge'
import type { IProvider, TransactionResponse } from '@rarimo/provider'
import type {
  Amount,
  BridgeChain,
  ChainTypes,
  Computed,
  HexString,
  Raw,
  Ref,
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
   * @param {Token} args.from - Input token
   * @param {Token} args.to - Output token after swap or wrap\unwrap
   * @param {Amount} args.amountIn - Amount of input token
   * @param {Amount} [args.amountOut] - Amount of output token, required if swap is required
   * @param {string} [args.receiver] - Could be another contract, if empty it will be caller by default
   * @param {string|string[]} [args.path] - DEX swap token path, required if swap is required
   * @param {BridgeChain} [args.chainTo] - Destination chain object, required if bridging is required
   * @param {TransactionBundle} [args.bundle]: - Transaction bundle {@link https://docs.rarimo.com/docs/overview/bundling},
   * required if transaction bundling is required
   * @param {boolean} [args.isWrapped] - Determines does input token is wrapped by the Rarimo bridge
   * (does it should be burned during the deposit), required if bridging is required,
   * @param {boolean} [args.handleAllowance] - Does handling of allowance is required,
   * like checking allowance and if it less than input amount - approve tx will be submitted
   *
   * @returns {Promise<TransactionResponse>}
   */
  execute(args: ExecuteArgs): Promise<TransactionResponse>
  /**
   * Proxy function of {@link Bridger.loadSupportedChains}
   */
  supportedChains(): Promise<BridgeChain[]>
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
  ): Promise<TransactionResponse | undefined>
  /**
   * Proxy function of {@link Bridger.approveIfNeeded}
   */
  approveIfNeeded(
    token: Token,
    operator: HexString,
    amount?: Amount,
  ): Promise<TransactionResponse | undefined>
  /**
   * Proxy function of {@link Bridger.getInternalTokenMapping}
   */
  getInternalTokenMapping(
    targetTokenSymbol: string,
  ): Promise<InternalToken | undefined>
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

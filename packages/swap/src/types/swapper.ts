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
  TransactionBundle,
} from '@rarimo/shared'
import { EVMDexType } from '@rarimo/shared'

export type SwapperCreateFn = (p: IProvider) => Swapper

export type Swapper = Raw<{
  provider: Ref<IProvider>
  chains: Computed<BridgeChain[]>
  chainType: ChainTypes
  isInitialized: Ref<boolean>
  init(): Promise<void>
  /**
   * @description Submits a transaction to the swap contract to swap, wrap,
   * unwrap, bridge tokens
   * @returns Transaction Response
   */
  execute(
    args: ExecuteArgs,
    multiplePaymentOpts?: MultiplePaymentOpts,
  ): Promise<TransactionResponse>
  /**
   * Proxy function of {@link Bridger.getSupportedChains}
   */
  getSupportedChains(): Promise<BridgeChain[]>
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
}>

export type ExecuteArgs = {
  swapOpts: SwapOpts[]
  multiplePaymentsOpts?: MultiplePaymentOpts
  intermediateOpts?: IntermediateTokenOpts
  chainFrom: BridgeChain
  chainTo: BridgeChain
  // Could be another contract, if empty it will be caller by default
  receiver?: string
  // Transaction bundle {@link https://docs.rarimo.com/docs/overview/bundling},
  bundle?: TransactionBundle
  // Does handling of allowance be required, like checking allowance, and if it
  // less than input amount - approve tx will?
  handleAllowance?: boolean
  // Determines does deposit token be wrapped by the Rarimo bridge
  // (should it be burned during the deposit), required if bridging is required,
  isWrapped?: boolean
}

export type SwapOpts = {
  // Input token
  from: Token
  // Output token after swap or wrap\unwrap
  to: Token
  // Amount of input token
  amountIn: Amount
  // Amount of output token, required if swap is required
  amountOut: Amount
  // DEX swap a token path, required if swap is required
  path?: string[]
  protocol: EVMDexType
}

export type IntermediateTokenOpts = SwapOpts

export type MultiplePaymentOpts = {
  // Target amount of output token grabbed from the multiple input tokens
  amountOut: Amount
  // Target output token
  to: Token
}

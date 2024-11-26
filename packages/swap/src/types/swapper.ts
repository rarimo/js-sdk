import type { Raw } from '@distributedlab/reactivity'
import type { Bridger, Token } from '@rarimo/bridge'
import type { IProvider, TransactionResponse } from '@rarimo/provider'
import type { Amount, BridgeChain, TransactionBundle } from '@rarimo/shared'

export type SwapperCreateFn = (p: IProvider) => Swapper

export type Swapper = Bridger &
  Raw<{
    /**
     * @description Submits a transaction to the swap contract to swap, wrap,
     * unwrap, bridge tokens
     * @returns Transaction Response
     */
    execute(
      args: ExecuteArgs,
      multiplePaymentOpts?: MultiplePaymentOpts,
    ): Promise<TransactionResponse>
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
}

export type IntermediateTokenOpts = SwapOpts

export type MultiplePaymentOpts = {
  // Target amount of output token grabbed from the multiple input tokens
  amountOut: Amount
  // Target output token
  to: Token
}

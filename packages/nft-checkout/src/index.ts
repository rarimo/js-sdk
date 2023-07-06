import type { IProvider } from '@rarimo/provider'

import type {
  CheckoutOperation,
  CheckoutOperationCreateFunction,
} from '@/types'

/**
 *
 * @description Creates a transaction to buy NFTs and bundle other operations.
 *
 * For a full example, see [@rarimo/nft-checkout](../modules/_rarimo_nft_checkout.html).
 *
 * @example
 * const provider = await createProvider(MetamaskProvider)
 * const op = await createCheckoutOperation(EVMCheckoutOperation, provider)
 */
export const createCheckoutOperation = (
  createOpFn: CheckoutOperationCreateFunction,
  provider: IProvider,
): CheckoutOperation => {
  return createOpFn(provider)
}

export * from './entities'
export * from './enums'
export * from './operations'
export * from './types'
export { WRAPPED_CHAIN_TOKEN_SYMBOLS } from '@rarimo/swap'

// re-exports for the backward compatibility
export type { BridgeChain } from '@rarimo/shared'
export { CHAIN_IDS, ChainNames } from '@rarimo/shared'

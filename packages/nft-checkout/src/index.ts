import type { IProvider } from '@rarimo/provider'

import type {
  CheckoutOperation,
  CheckoutOperationCreateFunction,
  CheckoutOperationParams,
} from '@/types'

/**
 *
 * @description Creates a transaction to buy NFTs and bundle other operations.
 *
 * For a full example, see [@rarimo/nft-checkout](../modules/_rarimo_nft_checkout.html).
 *
 * @example
 * const provider = await createProvider(MetamaskProvider)
 * const op = await createCheckoutOperation(EVMCheckoutOperation, provider, params)
 */
export const createCheckoutOperation = async (
  createOpFn: CheckoutOperationCreateFunction,
  provider: IProvider,
  params: CheckoutOperationParams,
): Promise<CheckoutOperation> => {
  const op = createOpFn(provider, params)
  await op.init()
  return op
}

export * from './entities'
export * from './enums'
export * from './operations'
export * from './types'
export { WRAPPED_CHAIN_TOKEN_SYMBOLS } from '@rarimo/swap'

// re-exports for the backward compatibility
export type { BridgeChain } from '@rarimo/shared'
export { CHAIN_IDS, ChainNames } from '@rarimo/shared'

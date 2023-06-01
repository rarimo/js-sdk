import type { IProvider } from '@rarimo/provider'

import type { Swapper, SwapperCreateFn } from '@/types'

/**
 * @description Instead of using this function directly, run token swaps as transactions with the [@rarimo/nft-checkout]() package.
 * For more information about swaps, see [Swapping tokens](https://docs.rarimo.com/overview/swapping-tokens) in the Rarimo documentation.
 */
export const createSwapper = (
  createFn: SwapperCreateFn,
  provider: IProvider,
): Swapper => createFn(provider)

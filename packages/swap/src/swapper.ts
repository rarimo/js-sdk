import type { IProvider } from '@rarimo/provider'

import type { Swapper, SwapperCreateFn } from '@/types'

export const createSwapper = (
  createFn: SwapperCreateFn,
  provider: IProvider,
): Swapper => createFn(provider)

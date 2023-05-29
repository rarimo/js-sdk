import type { Token } from '@rarimo/bridge'
import type { IProvider } from '@rarimo/provider'

// import { toLowerCase as lc } from '@rarimo/shared'
import { errors } from '@/errors'
import type {
  CheckoutOperationParams,
  EstimatedPrice,
  PaymentToken,
} from '@/types'

import { estimateTraderJoe } from './joe-trader'
import { estimatePancakeSwap } from './pancake-swap'
import { estimateQuickSwap } from './quick-swap'
import { estimateUniswapV3 } from './uniswap-v3'

export const estimate = async (
  provider: IProvider,
  tokens: Token[],
  from: PaymentToken,
  params: CheckoutOperationParams,
  targetToken: Token,
): Promise<EstimatedPrice> => {
  if (!from || !targetToken) {
    throw new errors.OperationInvalidSelectedTokenPairError()
  }

  const opts: [Token[], IProvider, Token, Token, CheckoutOperationParams] = [
    tokens,
    provider,
    from,
    targetToken!,
    params,
  ]

  if (from.isTraderJoe) {
    return estimateTraderJoe(...opts)
  }

  if (from.isPancakeSwap) {
    return estimatePancakeSwap(...opts)
  }

  if (from.isQuickSwap) {
    return estimateQuickSwap(...opts)
  }

  return estimateUniswapV3(...opts)
}

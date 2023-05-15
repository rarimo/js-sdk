import type { Token } from '@rarimo/bridge'
import type { IProvider } from '@rarimo/provider'

import { errors } from '@/errors'
import { toLow } from '@/helpers'
import type { EstimatedPrice, PaymentToken, Target } from '@/types'

import { estimateTraderJoe } from './joe-trader'
import { estimatePancakeSwap } from './pancake-swap'
import { estimateQuickSwap } from './quick-swap'
import { estimateUniswapV3 } from './uniswap-v3'

export const estimate = async (
  provider: IProvider,
  tokens: Token[],
  from: PaymentToken,
  target: Target,
): Promise<EstimatedPrice> => {
  const targetToken = tokens.find(
    t => toLow(t.symbol) === toLow(target.swapTargetTokenSymbol),
  )

  if (toLow(from.address) === toLow(targetToken?.address)) {
    throw new errors.OperationInvalidSelectedTokenPairError()
  }

  const params: [Token[], IProvider, Token, Token, Target] = [
    tokens,
    provider,
    from,
    targetToken!,
    target,
  ]

  if (from.isTraderJoe) {
    return estimateTraderJoe(...params)
  }

  if (from.isPancakeSwap) {
    return estimatePancakeSwap(...params)
  }

  if (from.isQuickSwap) {
    return estimateQuickSwap(...params)
  }

  return estimateUniswapV3(...params)
}
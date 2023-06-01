import type { Token } from '@rarimo/bridge'
import type { IProvider } from '@rarimo/provider'

import { errors } from '@/errors'
import {
  createWrapUnwrapEstimate,
  handleNativeTokens,
  isUnwrapOnly,
  isWrapOnly,
} from '@/operations/evm/helpers'
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
    targetToken,
    params,
  ]

  const { from: fromHandled, to: targetTokenHandled } = handleNativeTokens(
    tokens,
    from,
    targetToken,
  )

  const isUnwrap = isUnwrapOnly(targetToken, targetTokenHandled, fromHandled)

  // If this is only wrap\unwrap operation thus we don't need to estimate price,
  // because wrap\unwrap price is always 1:1
  if (isWrapOnly(from, fromHandled, targetTokenHandled) || isUnwrap) {
    return createWrapUnwrapEstimate(
      from,
      isUnwrap ? targetToken : fromHandled,
      params,
    )
  }

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

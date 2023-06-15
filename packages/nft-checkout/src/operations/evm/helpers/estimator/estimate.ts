import type { Token } from '@rarimo/bridge'
import type { IProvider } from '@rarimo/provider'
import type { Amount } from '@rarimo/shared'

import { errors } from '@/errors'
import type {
  CheckoutOperationParams,
  EstimatedPrice,
  PaymentToken,
} from '@/types'

import {
  createWrapUnwrapEstimate,
  handleNativeTokens,
  isUnwrapOnly,
  isWrapOnly,
} from './helpers'
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
  amountOut?: Amount,
): Promise<EstimatedPrice> => {
  if (!from || !targetToken) {
    throw new errors.OperationInvalidSelectedTokenPairError()
  }

  const opts: [
    Token[],
    IProvider,
    Token,
    Token,
    CheckoutOperationParams,
    Amount | undefined,
  ] = [tokens, provider, from, targetToken, params, amountOut]

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
      amountOut,
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

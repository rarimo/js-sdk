import { BN } from '@distributedlab/tools'
import type { Token } from '@rarimo/bridge'
import {
  Amount,
  ChainId,
  NATIVE_TOKEN_WRAP_SLIPPAGE_MULTIPLIER,
  RARIMO_BRIDGE_FEE,
  toLowerCase as lc,
} from '@rarimo/shared'
import { WRAPPED_CHAIN_TOKEN_SYMBOLS } from '@rarimo/swap'

import { Price } from '@/entities'
import { errors, OperatorWrappedTokenNotFound } from '@/errors'
import type { CheckoutOperationParams, EstimatedPrice } from '@/types'

const ONE = 1
const ONE_HUNDRED = 100

export const handleNativeToken = (tokens: Token[], token: Token): Token => {
  const _token = token.isNative
    ? getWrappedToken(tokens, token.chain.id)
    : token

  if (!_token) throw new OperatorWrappedTokenNotFound()

  return _token
}

export const handleNativeTokens = (
  tokens: Token[],
  _from: Token,
  _to: Token,
): { from: Token; to: Token } => {
  const from = handleNativeToken(tokens, _from)
  const to = handleNativeToken(tokens, _to)
  return { from, to }
}

const getWrappedToken = (
  tokens: Token[],
  fromChainId: ChainId,
): Token | undefined => {
  const symbol = WRAPPED_CHAIN_TOKEN_SYMBOLS[Number(fromChainId)] ?? ''
  return tokens.find(t => lc(t.symbol) === lc(symbol))
}

export const validateSlippage = (slippage: number) => {
  if (slippage < 0 || slippage > 100) {
    throw new errors.OperatorInvalidSlippageError()
  }
}

export const getSwapAmount = (params: CheckoutOperationParams): Amount => {
  const rawPrice = params.price
  if (isSameChainOperation(params)) return rawPrice

  const decimals = rawPrice.decimals
  const numerator = BN.fromBigInt(rawPrice.value, decimals)

  const percentBN = BN.fromRaw(RARIMO_BRIDGE_FEE, decimals).div(
    BN.fromRaw(ONE_HUNDRED, decimals),
  )

  const denominator = BN.fromRaw(ONE, decimals).sub(percentBN)

  return Amount.fromBigInt(numerator.div(denominator).value, rawPrice.decimals)
}

export const getNativeAmountIn = (
  params: CheckoutOperationParams,
  rawPrice: Price | Amount,
): Amount => {
  if (isSameChainOperation(params)) return rawPrice

  const amountWithSlippage = BN.fromBigInt(
    rawPrice.value,
    rawPrice.decimals,
  ).mul(BN.fromRaw(NATIVE_TOKEN_WRAP_SLIPPAGE_MULTIPLIER, rawPrice.decimals))

  return Amount.fromBigInt(amountWithSlippage.value, rawPrice.decimals)
}

export const isWrapOnly = (
  fromRaw: Token,
  fromHandled: Token,
  to: Token,
): boolean => {
  return fromRaw.isNative && lc(fromHandled.address) === lc(to.address)
}

export const isUnwrapOnly = (
  toRaw: Token,
  toHandled: Token,
  from: Token,
): boolean => {
  return toRaw.isNative && lc(toHandled.address) === lc(from.address)
}

export const createWrapUnwrapEstimate = (
  from: Token,
  to: Token,
  params: CheckoutOperationParams,
): EstimatedPrice => ({
  impact: '0',
  from,
  to,
  price: createWrapPrice(params),
})

export const createWrapPrice = (params: CheckoutOperationParams) => {
  return Price.fromBigInt(
    getSwapAmount(params).value,
    params.price.decimals,
    params.price.symbol,
  )
}

export const isSameChainOperation = (params: CheckoutOperationParams) => {
  return Number(params.chainIdFrom) === Number(params.chainIdTo)
}

import type { Token } from '@rarimo/bridge'
import type { ChainId } from '@rarimo/shared'
import { WRAPPED_CHAIN_TOKEN_SYMBOLS } from '@rarimo/swap'

import { OperatorWrappedTokenNotFound } from '@/errors'
import { toLow } from '@/helpers'

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
  return tokens.find(t => toLow(t.symbol) === toLow(symbol))
}

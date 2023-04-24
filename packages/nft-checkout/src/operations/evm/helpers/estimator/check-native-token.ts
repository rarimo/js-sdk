import type { ChainId } from '@rarimo/provider'

import type { Token } from '@/entities'
import { OperatorWrappedTokenNotFound } from '@/errors'

import { TARGET_TOKEN_SYMBOLS } from '../chain'

export const handleNativeToken = (tokens: Token[], token: Token): Token => {
  const _token = token.isNative
    ? getWrappedToken(tokens, token.chain.id)
    : token

  if (!_token) {
    throw new OperatorWrappedTokenNotFound()
  }

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
  const symbol = TARGET_TOKEN_SYMBOLS[Number(fromChainId)] ?? ''
  return tokens.find(t => t.symbol === symbol)
}

import type { Token } from '@rarimo/bridge'
import { tokenFromChain, tokenFromInternalSupportedToken } from '@rarimo/bridge'
import type { BridgeChain, InternalSupportedToken } from '@rarimo/shared'
import { loadSupportedTokens, toLowerCase } from '@rarimo/shared'

import { errors } from '@/errors'

export const loadTokens = async (chain: BridgeChain): Promise<Token[]> => {
  let tokens: InternalSupportedToken[] = []

  try {
    tokens = await loadSupportedTokens(chain)
  } catch (e) {
    throw new errors.OperationSupportedTokensLoadFailedError(e as Error)
  }

  if (!tokens.length) return []

  return tokens.map(i => tokenFromInternalSupportedToken(i, chain))
}

export const getTokenByAddress = (tokens: Token[], address: string) => {
  return tokens.find(t => toLowerCase(t.address) === toLowerCase(address))
}

export const getSameChainSwapToToken = (
  chain: BridgeChain,
  tokens: Token[],
  address?: string,
) => {
  if (!address) return tokenFromChain(chain)
  const token = getTokenByAddress(tokens, address)
  if (token) return token
  throw new errors.OperationSwapToTokenNotFoundError()
}

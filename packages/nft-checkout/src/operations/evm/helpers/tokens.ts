import type { Token } from '@rarimo/bridge'
import { tokenFromInternalSupportedToken } from '@rarimo/bridge'
import type { BridgeChain, InternalSupportedToken } from '@rarimo/shared'
import { loadSupportedTokens } from '@rarimo/shared'

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

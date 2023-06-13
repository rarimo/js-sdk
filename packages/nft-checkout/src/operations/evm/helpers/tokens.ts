import type { Token } from '@rarimo/bridge'
import { newToken } from '@rarimo/bridge'
import type { BridgeChain, InternalSupportedToken } from '@rarimo/shared'
import { loadSupportedTokens } from '@rarimo/shared'

import { errors } from '@/errors'

export const NATIVE_TOKEN_ADDRESS = '0x0000000000000000000000000000000000000000'

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

const tokenFromInternalSupportedToken = (
  token: InternalSupportedToken,
  chain: BridgeChain,
): Token => {
  const address = token.id

  return newToken({
    chain,
    address: address === NATIVE_TOKEN_ADDRESS ? '' : address,
    name: token.name,
    symbol: token.symbol,
    decimals: token.decimals,
    logoURI: token.logo_uri,
    isNative: Boolean(token.native),
  })
}

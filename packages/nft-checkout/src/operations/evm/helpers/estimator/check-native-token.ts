import { CHAIN_IDS } from '../../../../const'
import { OperatorWrappedTokenNotFound } from '../../../../errors'
import { ChainNames } from '../../../../enums'
import { TARGET_TOKEN_SYMBOLS } from '../chain'
import { ChainId, ChainTypes } from '@rarimo/provider'
import { Token } from '../../../../entities'

export const getToken = (
  tokens: Token[],
  token: Token,
  toChainId: ChainId,
): Token => {
  const _token = token.isNative
    ? getWrappedToken(tokens, token.chain.id, toChainId)
    : token

  if (!_token) {
    throw new OperatorWrappedTokenNotFound()
  }

  return _token
}

const getWrappedToken = (
  tokens: Token[],
  fromChainId: ChainId,
  toChainId: ChainId,
): Token | undefined => {
  const chains = CHAIN_IDS[ChainTypes.EVM]
  let symbol = ''

  const _fromChainId = Number(fromChainId)
  const _toChainId = Number(toChainId)

  symbol = TARGET_TOKEN_SYMBOLS[_fromChainId] ?? ''

  // TODO: do something with this please
  // For the Avalanche Wrapped ethereum symbol is WETH.e.
  // WETH is a symbol for Wormhole ethereum which has low liquidity
  if (
    _fromChainId === chains[ChainNames.Avalanche] &&
    _toChainId === chains[ChainNames.Ethereum]
  ) {
    symbol = 'WETH.e'
  }

  return tokens.find(t => t.symbol === symbol)
}

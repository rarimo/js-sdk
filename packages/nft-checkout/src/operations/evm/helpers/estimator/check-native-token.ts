import { BridgeChain, Token } from '../../../../types'
import { CHAIN_IDS } from '../../../../const'
import { OperatorWrappedTokenNotFound } from '../../../../errors'
import { ChainNames } from '../../../../enums'
import { TARGET_TOKEN_SYMBOLS } from '../chain'
import { ChainId, ChainTypes } from '@rarimo/provider'

export const isNativeToken = (chains: BridgeChain[], token: Token): boolean => {
  const chain = chains.find(chain => chain.id === token.chain.id)
  return chain?.token?.symbol === token.symbol
}

export const getFromToken = (
  chains: BridgeChain[],
  tokens: Token[],
  from: Token,
  toChainId: ChainId,
): Token => {
  const isNative = isNativeToken(chains, from)
  console.log({ isNative })

  const _from = isNative
    ? getWrappedToken(tokens, from.chain.id, toChainId)
    : from

  if (!_from) {
    throw new OperatorWrappedTokenNotFound()
  }

  return _from
}

export const getWrappedToken = (
  tokens: Token[],
  fromChainId: ChainId,
  toChainId: ChainId,
): Token | undefined => {
  const chains = CHAIN_IDS[ChainTypes.EVM]
  let symbol = ''

  const _fromChainId = Number(fromChainId)
  const _toChainId = Number(toChainId)

  // TODO: do something with this please
  // For the Avalanche Wrapped ethereum symbol is WETH.e.
  // WETH is a symbol for Wormhole ethereum which has low liquidity
  if (
    _fromChainId === chains[ChainNames.Avalanche] &&
    _toChainId === chains[ChainNames.Ethereum]
  ) {
    symbol = 'WETH.e'
  }

  symbol = TARGET_TOKEN_SYMBOLS[_fromChainId] ?? ''

  return tokens.find(t => t.symbol === symbol)
}

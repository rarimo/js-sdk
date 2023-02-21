import JSBI from 'jsbi'
import { IProvider } from '@rarimo/provider'
import { BridgeChain, EstimatedPrice, Target, Token } from '@/types'

import {
  ChainId,
  Fetcher,
  Percent,
  Route,
  Token as TJToken,
  TokenAmount,
  Trade,
  TradeType,
} from '@traderjoe-xyz/sdk'
import { Price } from '@/entities'
import { validateSlippage } from './slippage'
import { getFromToken } from './check-native-token'

const getSlippage = (slippage?: number): Percent => {
  if (!slippage) {
    return new Percent('5', '100')
  }

  validateSlippage(slippage)

  return new Percent(String(slippage), '1')
}

export const estimateJoeTrader = async (
  tokens: Token[],
  chains: BridgeChain[],
  provider: IProvider,
  from: Token,
  to: Token,
  target: Target,
): Promise<EstimatedPrice> => {
  const _from = getFromToken(chains, tokens, from, to.chain.id)

  const tokenA = new TJToken(
    Number(_from.chain.id),
    _from.address,
    _from.decimals,
    _from.symbol,
    _from.name,
  )

  const tokenB = new TJToken(
    Number(_from.chain.id),
    to.address,
    to.decimals,
    to.symbol,
    to.name,
  )

  const amount = new TokenAmount(tokenB, JSBI.BigInt(target.price.value))

  const pair = await Fetcher.fetchPairData(
    tokenA,
    tokenB,
    provider?.getWeb3Provider?.(),
  )

  const route = new Route([pair], tokenA, tokenB)

  const trade = new Trade(
    route,
    amount,
    TradeType.EXACT_OUTPUT,
    Number(_from.chain.id) as ChainId,
  )

  return {
    impact: trade.priceImpact.toSignificant(3),
    path: trade.route.path.map(token => token.address),
    from,
    to,
    price: Price.fromFraction(
      trade.maximumAmountIn(getSlippage(target.slippage)).numerator.toString(),
      _from.decimals,
      _from.symbol,
    ),
  }
}

import JSBI from 'jsbi'
import { IProvider } from '@rarimo/provider'
import { EstimatedPrice, Target, Token } from '@/types'

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

const getSlippage = (slippage?: number): Percent => {
  if (!slippage) {
    return new Percent('5', '100')
  }

  validateSlippage(slippage)

  return new Percent(String(slippage), '1')
}

export const estimateJoeTrader = async (
  provider: IProvider,
  from: Token,
  to: Token,
  target: Target,
): Promise<EstimatedPrice> => {
  const tokenA = new TJToken(
    Number(from.chain.id),
    from.address,
    from.decimals,
    from.symbol,
    from.name,
  )

  const tokenB = new TJToken(
    Number(from.chain.id),
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
    Number(from.chain.id) as ChainId,
  )

  return {
    impact: trade.priceImpact.toSignificant(3),
    path: trade.route.path.map(token => token.address),
    from,
    to,
    price: Price.fromFraction(
      trade.maximumAmountIn(getSlippage(target.slippage)).numerator.toString(),
      from.decimals,
      from.symbol,
    ),
  }
}

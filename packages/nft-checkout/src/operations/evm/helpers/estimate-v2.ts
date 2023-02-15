import { JsonRpcProvider } from '@ethersproject/providers'
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
import JSBI from 'jsbi'

export const estimateV2 = async (
  rpc: JsonRpcProvider,
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

  const pair = await Fetcher.fetchPairData(tokenA, tokenB, rpc)
  const route = new Route([pair], tokenA, tokenB)

  const trade = new Trade(
    route,
    amount,
    TradeType.EXACT_OUTPUT,
    Number(from.chain.id) as ChainId,
  )

  return {
    impact: trade.priceImpact.toSignificant(3),
    from,
    to,
    price: {
      value: trade
        .maximumAmountIn(new Percent('5', '100'))
        .numerator.toString(),
      decimals: from.decimals,
      symbol: from.symbol,
    },
  }
}

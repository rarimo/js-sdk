import JSBI from 'jsbi'
import { Target, Token } from '@/types'
import {
  Token as PCToken,
  Route,
  Trade,
  TradeType,
  Percent,
} from '@pancakeswap/sdk'
import { CurrencyAmount } from '@pancakeswap/swap-sdk-core'
import { getAllCommonPairs } from '@pancakeswap/smart-router/evm'
import { IProvider } from '@rarimo/provider'
import { Provider as EtherProvider } from '@ethersproject/providers'
import { Price } from '@/entities'
import { validateSlippage } from './slippage'

const getSlippage = (slippage?: number): Percent => {
  if (!slippage) {
    return new Percent('5', '100')
  }

  validateSlippage(slippage)

  return new Percent(slippage, 1)
}

export const estimatePancakeSwap = async (
  provider: IProvider,
  from: Token,
  to: Token,
  target: Target,
) => {
  const tokenA = new PCToken(
    Number(from.chain.id),
    from.address,
    from.decimals,
    from.symbol,
    from.name,
  )

  const tokenB = new PCToken(
    Number(from.chain.id),
    to.address,
    to.decimals,
    to.symbol,
    to.name,
  )

  const amount = CurrencyAmount.fromRawAmount(
    tokenB,
    JSBI.BigInt(target.price.value),
  )

  const pairs = await getAllCommonPairs(tokenA, tokenB, {
    provider: () => provider?.getWeb3Provider?.() as EtherProvider,
  })

  const route = new Route(pairs, tokenA, tokenB)
  const trade = new Trade(route, amount, TradeType.EXACT_OUTPUT)

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

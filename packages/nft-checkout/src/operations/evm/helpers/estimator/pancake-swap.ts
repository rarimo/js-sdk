import { Target } from '../../../../types'
import { Price, Token } from '../../../../entities'
import { validateSlippage } from './slippage'
import { getToken } from './check-native-token'
import JSBI from 'jsbi'
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

const PANCAKE_DEFAULT_SLIPPAGE = new Percent('5', '100')

const getSlippage = (slippage?: number): Percent => {
  if (!slippage) {
    return PANCAKE_DEFAULT_SLIPPAGE
  }

  validateSlippage(slippage)

  return new Percent(slippage, 1)
}

export const estimatePancakeSwap = async (
  tokens: Token[],
  provider: IProvider,
  from: Token,
  to: Token,
  target: Target,
) => {
  const _from = getToken(tokens, from, to.chain.id)
  const _to = getToken(tokens, to, from.chain.id)

  const tokenA = new PCToken(
    Number(_from.chain.id),
    _from.address,
    _from.decimals,
    _from.symbol,
    _from.name,
  )

  const tokenB = new PCToken(
    Number(from.chain.id),
    _to.address,
    _to.decimals,
    _to.symbol,
    _to.name,
  )

  const amount = CurrencyAmount.fromRawAmount(
    tokenB,
    JSBI.BigInt(target.price.value),
  )

  const pairs = await getAllCommonPairs(tokenA, tokenB, {
    provider: () => provider?.getWeb3Provider?.() as EtherProvider,
  })

  const route = new Route(
    pairs.filter(
      p =>
        (p.token0.address === tokenA.address ||
          p.token1.address === tokenA.address) &&
        (p.token0.address === tokenB.address ||
          p.token1.address === tokenB.address),
    ),
    tokenA,
    tokenB,
  )
  const trade = new Trade(route, amount, TradeType.EXACT_OUTPUT)

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

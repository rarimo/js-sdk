import type { Token } from '@rarimo/bridge'
import type { IProvider } from '@rarimo/provider'
import {
  Fetcher,
  Percent,
  Route,
  Token as QSToken,
  TokenAmount,
  Trade,
} from '@rarimo/quickswap-sdk'

import { Price } from '@/entities'
import type { EstimatedPrice, Target } from '@/types'

import { handleNativeTokens } from './check-native-token'
import { getSwapAmount } from './get-swap-amount'
import { validateSlippage } from './slippage'

const QUICK_SWAP_DEFAULT_SLIPPAGE = new Percent('5', '100')

const getSlippage = (slippage?: number): Percent => {
  if (!slippage) {
    return QUICK_SWAP_DEFAULT_SLIPPAGE
  }

  validateSlippage(slippage)

  return new Percent(String(slippage), '1')
}

export const estimateQuickSwap = async (
  tokens: Token[],
  provider: IProvider,
  _from: Token,
  _to: Token,
  target: Target,
): Promise<EstimatedPrice> => {
  const { from, to } = handleNativeTokens(tokens, _from, _to)

  const tokenA = new QSToken(
    Number(from.chain.id),
    from.address,
    from.decimals,
    from.symbol,
    from.name,
  )

  const tokenB = new QSToken(
    Number(from.chain.id),
    to.address,
    to.decimals,
    to.symbol,
    to.name,
  )

  const amount = new TokenAmount(tokenB, getSwapAmount(target.price))

  const pair = await Fetcher.fetchPairData(
    tokenA,
    tokenB,
    provider?.getWeb3Provider?.(),
  )

  const route = new Route([pair], tokenA, tokenB)
  const trade = Trade.exactOut(route, amount)

  return {
    impact: trade.priceImpact.toSignificant(3),
    path: trade.route.path.map(token => token.address),
    from: _from,
    to: _to,
    price: Price.fromBigInt(
      trade.maximumAmountIn(getSlippage(target.slippage)).numerator.toString(),
      _from.decimals,
      _from.symbol,
    ),
  }
}

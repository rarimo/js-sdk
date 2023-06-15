import type { Token } from '@rarimo/bridge'
import type { IProvider } from '@rarimo/provider'
import type { Amount } from '@rarimo/shared'
import {
  ChainId,
  Fetcher,
  Percent,
  Route,
  Token as TJToken,
  TokenAmount,
  Trade,
} from '@traderjoe-xyz/sdk'

import { Price } from '@/entities'
import type { CheckoutOperationParams, EstimatedPrice } from '@/types'

import { getSwapAmount, handleNativeTokens, validateSlippage } from './helpers'

const TRADER_JOE_DEFAULT_SLIPPAGE = new Percent('5', '100')

const getSlippage = (slippage?: number): Percent => {
  if (!slippage) {
    return TRADER_JOE_DEFAULT_SLIPPAGE
  }

  validateSlippage(slippage)

  return new Percent(String(slippage), '1')
}

export const estimateTraderJoe = async (
  tokens: Token[],
  provider: IProvider,
  _from: Token,
  _to: Token,
  params: CheckoutOperationParams,
  amountOut?: Amount,
): Promise<EstimatedPrice> => {
  const { from, to } = handleNativeTokens(tokens, _from, _to)

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

  const amount = new TokenAmount(tokenB, getSwapAmount(params, amountOut).value)

  const pair = await Fetcher.fetchPairData(
    tokenA,
    tokenB,
    provider?.getWeb3Provider?.(),
  )

  const route = new Route([pair], tokenA, tokenB)
  const trade = Trade.exactOut(route, amount, Number(from.chain.id) as ChainId)

  return {
    impact: trade.priceImpact.toSignificant(3),
    path: trade.route.path.map(token => token.address),
    from: _from,
    to: _to,
    price: Price.fromBigInt(
      trade.maximumAmountIn(getSlippage(params.slippage)).numerator.toString(),
      _from.decimals,
      _from.symbol,
    ),
    amountOut,
  }
}

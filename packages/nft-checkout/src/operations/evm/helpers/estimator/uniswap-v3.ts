import { EstimatedPrice, Target, Token } from '@/types'
import { Price } from '@/entities'
import {
  Currency,
  CurrencyAmount,
  Fraction,
  Percent,
  Token as UNIToken,
  TradeType,
} from '@uniswap/sdk-core'
import { encodeRouteToPath, Route } from '@uniswap/v3-sdk'
import JSBI from 'jsbi'
import {
  AlphaRouter,
  ChainId as UNIChainId,
  RouteWithValidQuote,
} from '@uniswap/smart-order-router'
import { BN } from '@distributedlab/utils'
import { IProvider } from '@rarimo/provider'
import { errors } from '@/errors'
import { computeRealizedPriceImpact } from './uniswap-impact'
import { providers } from 'ethers'
import { validateSlippage } from './slippage'
import { getSwapAmount } from '@/operations/evm/helpers/estimator/get-swap-amount'

const V3_SWAP_DEFAULT_SLIPPAGE = new Percent(250, 10_000)

const getPrice = (
  from: Token,
  amount: CurrencyAmount<Currency> | undefined,
) => {
  if (!amount || JSBI.equal(amount?.quotient, JSBI.BigInt(0))) {
    return Price.fromRaw('0', from.decimals, from.symbol)
  }

  return Price.fromFraction(
    amount.numerator.toString(),
    from.decimals,
    from.symbol,
  )
}

const getRoutePath = (route: RouteWithValidQuote[]) => {
  return route.reduce((path, r) => {
    const p = encodeRouteToPath(r.route as Route<Currency, Currency>, true)
    path += path ? p.replace('0x', '') : p

    return path
  }, '')
}

const getSwapCurrencyAmount = (token: UNIToken, price: Price) => {
  return CurrencyAmount.fromRawAmount(token, JSBI.BigInt(getSwapAmount(price)))
}

const getSlippage = (slippage?: number): Percent => {
  if (!slippage) {
    return V3_SWAP_DEFAULT_SLIPPAGE
  }

  validateSlippage(slippage)

  return new Percent(slippage, 1)
}

export const estimateUniswapV3 = async (
  provider: IProvider,
  from: Token,
  to: Token,
  target: Target,
): Promise<EstimatedPrice> => {
  const tokenA = new UNIToken(
    Number(from.chain.id),
    from.address,
    from.decimals,
    from.symbol,
    from.name,
  )

  const tokenB = new UNIToken(
    Number(from.chain.id),
    to.address,
    to.decimals,
    to.symbol,
    to.name,
  )

  // Input amount is the original price of nft.
  const swapAmount = getSwapCurrencyAmount(tokenB, target.price)

  const router = new AlphaRouter({
    chainId: from.chain.id as UNIChainId,
    provider: provider?.getWeb3Provider?.() as providers.Web3Provider,
  })

  const route = await router.route(swapAmount, tokenA, TradeType.EXACT_OUTPUT, {
    recipient: provider.address ?? '',
    slippageTolerance: new Percent(5, 100),
    deadline: Math.floor(Date.now() / 1000 + 1800),
  })

  if (!route) throw new errors.OperationSwapRouteNotFound()

  const { estimatedGasUsedUSD, gasPriceWei, trade } = route

  const amount = CurrencyAmount.fromRawAmount(
    trade?.inputAmount.currency,
    new Fraction(JSBI.BigInt(1))
      .add(getSlippage(target.slippage))
      .multiply(trade?.inputAmount?.quotient).quotient,
  )

  return {
    from,
    to,
    impact: trade ? computeRealizedPriceImpact(trade) : undefined,
    price: getPrice(from, amount),
    path: getRoutePath(route.route),
    gasPriceInUSD: new BN(estimatedGasUsedUSD.numerator.toString())
      .fromFraction(estimatedGasUsedUSD.currency.decimals)
      .toString(),
    gasPrice: new BN(gasPriceWei.toString()).fromWei().toString(),
  }
}

import { BN } from '@distributedlab/tools'
import type { Token } from '@rarimo/bridge'
import type { IProvider } from '@rarimo/provider'
import type { Currency } from '@uniswap/sdk-core'
import {
  CurrencyAmount,
  Fraction,
  Percent,
  Token as UNIToken,
  TradeType,
} from '@uniswap/sdk-core'
import type { RouteWithValidQuote } from '@uniswap/smart-order-router'
import { AlphaRouter, ChainId as UNIChainId } from '@uniswap/smart-order-router'
import { encodeRouteToPath, Route } from '@uniswap/v3-sdk'
import type { providers } from 'ethers'
import JSBI from 'jsbi'

import { Price } from '@/entities'
import { errors } from '@/errors'
import type { CheckoutOperationParams, EstimatedPrice } from '@/types'

import { getSwapAmount, handleNativeTokens, validateSlippage } from './helpers'
import { computeRealizedPriceImpact } from './uniswap-impact'

const V3_SWAP_DEFAULT_SLIPPAGE = new Percent(250, 10_000)

const getRoutePath = (route: RouteWithValidQuote[], isNative: boolean) => {
  return route.reduce((path, r) => {
    const p = encodeRouteToPath(r.route as Route<Currency, Currency>, !isNative)
    path += path ? p.replace('0x', '') : p

    return path
  }, '')
}

const getSwapCurrencyAmount = (
  params: CheckoutOperationParams,
  token: UNIToken,
) => {
  return CurrencyAmount.fromRawAmount(token, getSwapAmount(params).value)
}

const getSlippage = (slippage?: number): Percent => {
  if (!slippage) {
    return V3_SWAP_DEFAULT_SLIPPAGE
  }

  validateSlippage(slippage)

  return new Percent(slippage, 1)
}

export const estimateUniswapV3 = async (
  tokens: Token[],
  provider: IProvider,
  _from: Token,
  _to: Token,
  params: CheckoutOperationParams,
): Promise<EstimatedPrice> => {
  const { from, to } = handleNativeTokens(tokens, _from, _to)

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
  const swapAmount = getSwapCurrencyAmount(params, tokenB)

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
      .add(getSlippage(params.slippage))
      .multiply(trade?.inputAmount?.quotient).quotient,
  )

  return {
    from: _from,
    to: _to,
    impact: trade ? computeRealizedPriceImpact(trade) : undefined,
    price: Price.fromBigInt(
      amount.numerator.toString() ?? '0',
      _from.decimals,
      _from.symbol,
    ),
    path: getRoutePath(route.route, _from.isNative),
    gasPriceInUSD: BN.fromBigInt(
      estimatedGasUsedUSD.numerator.toString(),
      estimatedGasUsedUSD.currency.decimals,
    ).toString(),
    gasPrice: BN.fromBigInt(gasPriceWei.toString(), BN.WEI_DECIMALS).toString(),
  }
}

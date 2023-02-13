import { JsonRpcProvider } from '@ethersproject/providers'
import { EstimatedPrice, Target, Token } from '@/types'
import {
  CurrencyAmount,
  Currency,
  Percent,
  Token as UNIToken,
  TradeType,
} from '@uniswap/sdk-core'
import { parseUnits } from '@ethersproject/units'
import JSBI from 'jsbi'
import { AlphaRouter, ChainId as UNIChainId } from '@uniswap/smart-order-router'
import { BN } from '@distributedlab/utils'
import { errors } from '@rarimo/provider'
import { computeRealizedPriceImpact } from './uniswap-impact'

const V3_SWAP_DEFAULT_SLIPPAGE = new Percent(250, 10_000) // .50%

export const parseAmount = (
  value: string,
  currency: Currency,
): CurrencyAmount<Currency> => {
  const typedValueParsed = parseUnits(value, currency.decimals).toString()
  return CurrencyAmount.fromRawAmount(currency, JSBI.BigInt(typedValueParsed))
}

export const estimateUniswap = async (
  rpc: JsonRpcProvider,
  from: Token,
  to: Token,
  target: Target,
): Promise<EstimatedPrice> => {
  const tokenA = new UNIToken(
    Number(from.chainId),
    from.address,
    from.decimals,
    from.symbol,
    from.name,
  )

  const tokenB = new UNIToken(
    Number(from.chainId),
    to.address,
    to.decimals,
    to.symbol,
    to.name,
  )

  const amountBN = new BN(target.price.value).fromFraction(
    target.price.decimals,
  )

  const fee = new BN(amountBN).mul(2.5).div(100) // 2.5% for bridge fee

  const swapAmount = parseAmount(amountBN.add(fee).toString(), tokenB)

  const router = new AlphaRouter({
    chainId: from.chainId as UNIChainId,
    provider: rpc,
  })

  const route = await router.route(swapAmount, tokenA, TradeType.EXACT_OUTPUT, {
    recipient: target.recipient,
    slippageTolerance: new Percent(5, 100),
    deadline: Math.floor(Date.now() / 1000 + 1800),
  })

  if (!route) throw new errors.OperationSwapRouteNotFound()

  const { estimatedGasUsedUSD, trade } = route

  const impact = trade
    ? computeRealizedPriceImpact(trade)?.toFixed(2)
    : undefined

  return {
    impact,
    from,
    to,
    price: [
      {
        value: estimatedGasUsedUSD.numerator.toString(),
        decimals: estimatedGasUsedUSD.currency.decimals,
        symbol: estimatedGasUsedUSD.currency.symbol ?? '',
      },
      {
        value: trade
          .maximumAmountIn(V3_SWAP_DEFAULT_SLIPPAGE)
          .numerator.toString(),
        decimals: from.decimals,
        symbol: from.symbol,
      },
    ],
  }
}

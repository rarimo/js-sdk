import { JsonRpcProvider } from '@ethersproject/providers'
import { EstimatedPrice, Price, Target, Token } from '@/types'
import {
  Currency,
  CurrencyAmount,
  Fraction,
  Percent,
  Token as UNIToken,
  TradeType,
} from '@uniswap/sdk-core'
import JSBI from 'jsbi'
import { AlphaRouter, ChainId as UNIChainId } from '@uniswap/smart-order-router'
import { BN } from '@distributedlab/utils'
import { errors } from '@rarimo/provider'
import { computeRealizedPriceImpact } from './uniswap-impact'

const V3_SWAP_DEFAULT_SLIPPAGE = new Percent(250, 10_000)

const getPrice = (
  from: Token,
  amount: CurrencyAmount<Currency> | undefined,
) => {
  const price = {
    symbol: from.symbol,
    value: '',
    decimals: from.decimals,
  }

  if (!amount || JSBI.equal(amount?.quotient, JSBI.BigInt(0))) {
    return price
  }

  price.value = amount.numerator.toString()

  return price
}

export const getSwapAmount = (price: Price) => {
  const amountBN = new BN(price.value).fromFraction(price.decimals)

  const fee = new BN(
    new BN(amountBN.toString(), { decimals: 24 }).mul(2.5).toString(),
    { decimals: 24 },
  ).div(100) // 2.5% for bridge fee

  return amountBN.add(fee).toFraction(price.decimals).toString()
}

const getSwapCurrencyAmount = (token: UNIToken, price: Price) => {
  return CurrencyAmount.fromRawAmount(token, JSBI.BigInt(getSwapAmount(price)))
}

export const estimateV3 = async (
  rpc: JsonRpcProvider,
  from: Token,
  to: Token,
  target: Target,
  walletAddress: string,
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
    provider: rpc,
  })

  const route = await router.route(swapAmount, tokenA, TradeType.EXACT_OUTPUT, {
    recipient: walletAddress,
    slippageTolerance: new Percent(5, 100),
    deadline: Math.floor(Date.now() / 1000 + 1800),
  })

  if (!route) throw new errors.OperationSwapRouteNotFound()

  const { estimatedGasUsedUSD, gasPriceWei, trade } = route

  const impact = trade ? computeRealizedPriceImpact(trade) : undefined

  const amount = CurrencyAmount.fromRawAmount(
    trade?.inputAmount.currency,
    new Fraction(JSBI.BigInt(1))
      .add(V3_SWAP_DEFAULT_SLIPPAGE)
      .multiply(trade?.inputAmount?.quotient).quotient,
  )

  const price = getPrice(from, amount)

  return {
    impact,
    gasPriceInUSD: new BN(estimatedGasUsedUSD.numerator.toString())
      .fromFraction(estimatedGasUsedUSD.currency.decimals)
      .toString(),
    gasPrice: new BN(gasPriceWei.toString()).fromWei().toString(),
    from,
    to,
    price,
  }
}

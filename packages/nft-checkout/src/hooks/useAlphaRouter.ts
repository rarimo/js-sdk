import { JsonRpcProvider as Provider } from '@ethersproject/providers'
import { Percent, Token, TradeType } from '@uniswap/sdk-core'
import { AlphaRouter } from '@uniswap/smart-order-router'

import { DEFAULT_LOCALE, V3_SWAP_DEFAULT_SLIPPAGE } from '@/const'
import { formatCurrencyAmount, parseAmount } from '@/helpers'
import { usePriceImpact } from '@/hooks'
import { SwapPriceInput } from '@/types'

export const useAlphaRouter = async (params: SwapPriceInput) => {
  const {
    chainId,
    inputToken,
    outputToken,
    jsonRPCUrlMap,
    inputAmount,
    paymentChainName,
    userWalletAddress,
  } = params

  const jsonRpcProvider = new Provider(jsonRPCUrlMap[paymentChainName], chainId)

  const TokenA = new Token(
    chainId,
    inputToken.address.toLowerCase(),
    inputToken.decimals,
    inputToken.symbol,
    inputToken.name,
  )

  const TokenB = new Token(
    chainId,
    outputToken.address.toLowerCase(),
    outputToken.decimals,
    outputToken.symbol,
    outputToken.name,
  )

  let newAmount = parseFloat(inputAmount)

  newAmount = newAmount + (newAmount * 2.5) / 100 // 2.5% for bridge fee

  const currencyAmount = parseAmount(newAmount.toString(), TokenB) // Input amount is the original price of nft.
  const router = new AlphaRouter({ chainId, provider: jsonRpcProvider }) // Instance of AutoRouter

  const route = await router.route(
    currencyAmount,
    TokenA,
    TradeType.EXACT_OUTPUT,
    {
      recipient: userWalletAddress,
      slippageTolerance: new Percent(5, 100),
      deadline: Math.floor(Date.now() / 1000 + 1800),
    },
  )

  let impact

  if (route) {
    const {
      estimatedGasUsedUSD,
      trade,
      // estimatedGasUsedQuoteToken
    } = route

    if (trade) {
      impact = usePriceImpact(trade)
    }

    const gasCostInUsd = estimatedGasUsedUSD.toFixed(
      Math.min(estimatedGasUsedUSD.currency.decimals, 6),
    )

    // const gasCostInUsdd = estimatedGasUsedQuoteToken.toFixed(
    //   Math.min(estimatedGasUsedQuoteToken.currency.decimals, 6),
    // )

    const estimatedPriceInToken = formatCurrencyAmount(
      trade.maximumAmountIn(V3_SWAP_DEFAULT_SLIPPAGE),
      6,
      DEFAULT_LOCALE,
    )

    return {
      impact,
      gasCostInUsd,
      estimatedPriceInToken,
      selectedTokenSymbol: TokenA.symbol,
      trade,
    }
  } else {
    throw new Error('No route found for swap.')
  }
}

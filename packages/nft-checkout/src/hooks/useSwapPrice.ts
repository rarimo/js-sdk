import { getDexProps } from '@/helpers'
import { SwapPriceInput } from '@/types'

export const useSwapPrice = async (params: SwapPriceInput) => {
  const { jsonRPCUrlMap, paymentChainName } = params

  if (jsonRPCUrlMap && !jsonRPCUrlMap[paymentChainName])
    throw new Error('Please provide proper JsonRPCUrlMap')

  const { swapPriceFetcher } = getDexProps(paymentChainName)

  let swapResult
  if (swapPriceFetcher) {
    swapResult = await swapPriceFetcher(params)
  }
  return swapResult
}

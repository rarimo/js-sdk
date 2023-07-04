import type { Token } from '@rarimo/bridge'
import { Amount, type ChainId } from '@rarimo/shared'

import { checkoutApi } from '@/api'
import { errors } from '@/errors'
import type {
  EstimateQueryParams,
  EstimateResponse,
  SwapEstimation,
} from '@/types'

export const getEstimation = async ({
  chainIdFrom,
  chainIdTo,
  from,
  to,
  amountOut,
  slippage,
}: {
  chainIdFrom: ChainId
  chainIdTo: ChainId
  from: Token
  to: Token
  amountOut: Amount
  slippage?: number
}): Promise<SwapEstimation> => {
  if (!from || !to) throw new errors.OperationInvalidSelectedTokenPairError()

  const query: EstimateQueryParams = {
    chainIdFrom: Number(chainIdFrom),
    chainIdTo: Number(chainIdTo),
    'amountOut[value]': amountOut.value,
    'amountOut[decimals]': amountOut.decimals,
    'from[name]': from.name,
    'from[symbol]': from.symbol,
    'from[decimals]': from.decimals,
    ...(from.address && { 'from[address]': from.address }),
    'to[name]': to.name,
    'to[symbol]': to.symbol,
    'to[decimals]': to.decimals,
    ...(to.address && { 'to[address]': to.address }),
    ...(slippage && { slippage }),
  }

  const { data } = await checkoutApi.get<EstimateResponse>(
    '/v1/uniswap/estimate',
    {
      query,
    },
  )

  if (!data) throw new errors.OperationEstimateError()

  const {
    path,
    impact,
    amountIn,
    amountOut: _amountOut,
    gasPrice,
    gasPriceInUSD,
  } = data

  return {
    from,
    to,
    path,
    impact,
    gasPrice,
    gasPriceInUSD,
    amountIn: Amount.fromPlainObject(amountIn),
    amountOut: Amount.fromPlainObject(_amountOut),
  }
}

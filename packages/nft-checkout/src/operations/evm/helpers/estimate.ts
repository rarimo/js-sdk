import type { Token } from '@rarimo/bridge'
import { newToken } from '@rarimo/bridge'
import { Amount, Price } from '@rarimo/shared'

import { checkoutApi } from '@/api'
import { errors } from '@/errors'
import type {
  CheckoutOperationParams,
  EstimatedPrice,
  EstimateQueryParams,
  EstimateResponse,
} from '@/types'

export const estimate = async (
  from: Token,
  to: Token,
  params: CheckoutOperationParams,
  amountOut?: Amount,
): Promise<EstimatedPrice> => {
  if (!from || !to) throw new errors.OperationInvalidSelectedTokenPairError()

  const query: EstimateQueryParams = {
    chainIdFrom: Number(from.chain.id),
    chainIdTo: Number(to.chain.id),
    'from[name]': from.name,
    'from[symbol]': from.symbol,
    'from[decimals]': from.decimals,
    ...(from.address && { 'from[address]': from.address }),
    'to[name]': to.name,
    'to[symbol]': to.symbol,
    'to[decimals]': to.decimals,
    ...(to.address && { 'to[address]': to.address }),
    'price[value]': params.price.value,
    'price[symbol]': params.price.symbol,
    'price[decimals]': params.price.decimals,
    ...(params.price.address && { 'price[address]': params.price.address }),
    ...(amountOut && {
      'amountOut[value]': amountOut.value,
      'amountOut[decimals]': amountOut.decimals,
    }),
    ...(params.slippage && { slippage: params.slippage }),
  }

  const { data } = await checkoutApi.get<EstimateResponse>(
    '/v1/uniswap/estimate',
    {
      query,
    },
  )

  if (!data) throw new errors.OperationEstimateError()

  return {
    from: newToken({
      chain: from.chain,
      name: data['from[name]'],
      symbol: data['from[symbol]'],
      decimals: Number(data['from[decimals]']),
      address: data['from[address]'] ?? '',
    }),
    to: newToken({
      chain: to.chain,
      name: data['to[name]'],
      symbol: data['to[symbol]'],
      decimals: data['to[decimals]'],
      address: data['to[address]'] ?? '',
    }),
    price: Price.fromBigInt(
      data['price[value]'],
      data['price[decimals]'],
      data['price[symbol]'],
      data['price[address]'],
    ),
    ...(data['amountOut[value]'] && {
      amountOut: Amount.fromBigInt(
        data['amountOut[value]'],
        Number(data['amountOut[decimals]']),
      ),
    }),
    ...(data.path && { path: data.path }),
    ...(data.impact && { impact: data.impact }),
    ...(data.gasPrice && { gasPrice: data.gasPrice }),
    ...(data.gasPriceInUSD && { gasPriceInUSD: data.gasPriceInUSD }),
  }
}

import type { Token } from '@rarimo/bridge'
import type { Amount, ClassInstanceToPlainObject } from '@rarimo/shared'
import type { SwapOpts } from '@rarimo/swap'

export type SwapEstimation = SwapOpts & SwapEstimationInfo

export type SwapEstimationInfo = {
  impact?: string
  gasPrice?: string
  gasPriceInUSD?: string
}

export type PaymentToken = Token & {
  balance: string
  balanceRaw: Amount
}

export type EstimateQueryParams = {
  'from[name]': string
  'from[symbol]': string
  'from[decimals]': number
  'from[address]'?: string
  'to[name]': string
  'to[symbol]': string
  'to[decimals]': number
  'to[address]'?: string
  'amountOut[value]': string
  'amountOut[decimals]': number
  chainIdFrom: number
  chainIdTo: number
  slippage?: number
}

export type EstimateResponse = SwapEstimationInfo & {
  path: string[]
  amountIn: ClassInstanceToPlainObject<Amount>
  amountOut: ClassInstanceToPlainObject<Amount>
}

import type { Token } from '@rarimo/bridge'
import type { Amount, Price } from '@rarimo/shared'

export type EstimatedPrice = {
  from: Token
  to: Token
  price: Price
  amountOut?: Amount
  path?: string[]
  impact?: string
  gasPrice?: string
  gasPriceInUSD?: string
}

export type PaymentToken = Token & {
  balance: string
  balanceRaw: Amount
}

export type EstimateAmountOutObject = {
  'amountOut[value]'?: string
  'amountOut[decimals]'?: number
}

export type EstimatePriceObject = {
  'price[value]': string
  'price[symbol]': string
  'price[decimals]': number
  'price[address]'?: string
}

export type EstimateTokensPath = {
  'from[name]': string
  'from[symbol]': string
  'from[decimals]': number
  'from[address]'?: string
  'to[name]': string
  'to[symbol]': string
  'to[decimals]': number
  'to[address]'?: string
}

export type EstimateQueryParams = EstimateTokensPath &
  EstimateAmountOutObject &
  EstimatePriceObject & {
    chainIdFrom: number
    chainIdTo: number
    slippage?: number
  }

export type EstimateResponse = EstimateTokensPath &
  EstimateAmountOutObject &
  EstimatePriceObject &
  Pick<EstimatedPrice, 'path' | 'impact' | 'gasPrice' | 'gasPriceInUSD'>

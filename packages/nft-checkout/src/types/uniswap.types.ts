import { Trade } from '@uniswap/router-sdk'
import { Currency, Percent, Token, TradeType } from '@uniswap/sdk-core'

// from https://github.com/Uniswap/routing-api/blob/main/lib/handlers/schema.ts

export type TokenInRoute = Pick<
  Token,
  'address' | 'chainId' | 'symbol' | 'decimals'
>

export class InterfaceTrade extends Trade<Currency, Currency, TradeType> {}

export interface PriceImpact {
  percent: Percent
  warning?: 'warning' | 'error'
  toString(): string
}

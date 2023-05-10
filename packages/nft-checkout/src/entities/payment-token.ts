import { newToken, Token } from '@rarimo/bridge'
import type { Amount } from '@rarimo/shared'
import type {
  Address,
  BridgeChain,
  Decimals,
  TokenSymbol,
} from '@rarimo/shared'

import type { PaymentToken } from '@/types'

export const newPaymentToken = (
  chain: BridgeChain,
  address: Address,
  name: string,
  symbol: TokenSymbol,
  decimals: Decimals,
  logoURI = '',
  balance: Amount,
) => {
  const token = newToken(chain, address, name, symbol, decimals, logoURI)
  return paymentTokenFromToken(token, balance)
}

export const paymentTokenFromToken = (
  token: Token,
  balance: Amount,
): PaymentToken => ({
  ...token,
  balance: balance.toString(),
  balanceRaw: balance,
})

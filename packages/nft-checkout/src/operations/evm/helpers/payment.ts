import { BN } from '@distributedlab/tools'
import type { Token } from '@rarimo/bridge'
import type { IProvider } from '@rarimo/provider'
import type { BridgeChain, InternalAccountBalance } from '@rarimo/shared'
import { NATIVE_TOKEN_ADDRESS } from '@rarimo/shared'
import {
  Amount,
  loadAccountBalances,
  parseTokenId,
  toLowerCase,
} from '@rarimo/shared'

import { paymentTokenFromToken } from '@/entities'
import type { PaymentToken } from '@/types'

import { getEstimation } from './get-estimation'

export const getPaymentTokensWithPairs = async ({
  provider,
  tokens,
  to,
  chainFrom,
  chainTo,
  amountOut,
  isMultiplePayment,
  slippage,
}: {
  provider: IProvider
  tokens: Token[]
  to: Token
  chainFrom: BridgeChain
  chainTo: BridgeChain
  amountOut: Amount
  isMultiplePayment: boolean
  slippage?: number
}) => {
  const paymentTokens = await getPaymentTokens(provider, chainFrom, tokens)
  const targetTokenSymbol = toLowerCase(to.symbol)
  const paymentTokensWithoutTarget = paymentTokens.filter(
    i => toLowerCase(i.symbol) !== targetTokenSymbol,
  )

  const estimatedPrices = await Promise.allSettled(
    paymentTokensWithoutTarget.map(i =>
      getEstimation({
        chainIdFrom: chainFrom.id,
        chainIdTo: chainTo.id,
        from: i,
        to,
        amountOut,
        slippage,
      }),
    ),
  )

  return estimatedPrices.reduce<PaymentToken[]>((acc, promise) => {
    if (promise.status !== 'fulfilled') return acc

    const from = promise.value.from
    const fromSymbol = toLowerCase(from.symbol)
    const paymentToken = paymentTokensWithoutTarget.find(
      t => toLowerCase(t.symbol) === fromSymbol,
    )

    if (!paymentToken) return acc

    if (isMultiplePayment) {
      acc.push(paymentToken)
      return acc
    }

    const isEnoughBalance = promise.value.amountIn.isLessThanOrEqualTo(
      paymentToken.balanceRaw,
    )

    if (isEnoughBalance) acc.push(paymentToken)

    return acc
  }, [])
}

const getPaymentTokens = async (
  provider: IProvider,
  chain: BridgeChain,
  tokens: Token[],
): Promise<PaymentToken[]> => {
  const balances = await loadAccountBalances(chain, provider.address!)

  if (!balances.length) return []

  return balances.reduce<PaymentToken[]>((acc, token) => {
    const paymentToken = createPaymentToken(tokens, token)
    if (paymentToken) acc.push(paymentToken)
    return acc
  }, [])
}

const createPaymentToken = (
  supportedTokens: Token[],
  balance: InternalAccountBalance,
): PaymentToken | undefined => {
  const [, address] = parseTokenId(balance.token.id)

  const token = supportedTokens.find(i =>
    address === NATIVE_TOKEN_ADDRESS
      ? i.isNative
      : toLowerCase(i.address) === toLowerCase(address),
  )

  if (!token || BN.fromBigInt(balance.amount, token.decimals).isZero) return

  return paymentTokenFromToken(
    token,
    Amount.fromBigInt(balance.amount, token.decimals),
  )
}

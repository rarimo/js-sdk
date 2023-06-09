import { BN } from '@distributedlab/tools'
import type { Token } from '@rarimo/bridge'
import { tokenFromChain } from '@rarimo/bridge'
import type { IProvider } from '@rarimo/provider'
import type {
  BridgeChain,
  InternalAccountBalance,
  TokenSymbol,
} from '@rarimo/shared'
import {
  Amount,
  ChainNames,
  loadAccountBalances,
  parseTokenId,
  toLowerCase,
} from '@rarimo/shared'
import type { Swapper } from '@rarimo/swap'

import { paymentTokenFromToken } from '@/entities'
import type { CheckoutOperationParams, PaymentToken } from '@/types'

import { estimate, getNativeAmountIn, isSameChainOperation } from './estimator'
import { loadTokens, NATIVE_TOKEN_ADDRESS } from './tokens'

const createPaymentToken = (
  supportedTokens: Token[],
  balance: InternalAccountBalance,
): PaymentToken | undefined => {
  const [, address] = parseTokenId(balance.token.id)

  const token = supportedTokens.find(
    i => toLowerCase(i.address) === toLowerCase(address),
  )

  if (!token || BN.fromBigInt(balance.amount, token.decimals).isZero) return

  return paymentTokenFromToken(
    token,
    Amount.fromBigInt(balance.amount, token.decimals),
  )
}

const getPaymentTokens = async (
  provider: IProvider,
  chain: BridgeChain,
  tokens: Token[],
): Promise<PaymentToken[]> => {
  const balances = await loadAccountBalances(chain, provider.address!)

  if (!balances.length) return []

  return balances.reduce((acc, token) => {
    const paymentToken = createPaymentToken(tokens, token)
    if (paymentToken) acc.push(paymentToken)
    return acc
  }, [] as PaymentToken[])
}

const INTERNAL_TOKENS_MAP: { [key in ChainNames]?: string } = {
  [ChainNames.Goerli]: '2',
  [ChainNames.Sepolia]: '3',
  [ChainNames.Fuji]: '4',
  [ChainNames.Chapel]: '5',
}

const getTargetTokenSymbol = (chain: BridgeChain, symbol: TokenSymbol) => {
  if (!chain.isTestnet) return symbol

  return INTERNAL_TOKENS_MAP[chain.name] ?? ''
}

export const getTargetToken = async (
  swapper: Swapper,
  params: CheckoutOperationParams,
  tokens: Token[],
  chainFrom: BridgeChain,
  chainTo: BridgeChain,
): Promise<Token | undefined> => {
  const isSameChain = isSameChainOperation(params)
  const targetTokenAddress = toLowerCase(params.price.address)

  // get target token from params if it's the same chain operation,
  // otherwise we will get it from internal mappings
  if (isSameChain) {
    return targetTokenAddress
      ? tokens.find(
          i => toLowerCase(i.address) === toLowerCase(targetTokenAddress),
        )
      : tokenFromChain(chainFrom)
  }

  const targetTokenSymbol = getTargetTokenSymbol(chainTo, params.price.symbol)

  if (!targetTokenSymbol) return

  const internalToken = await swapper.getInternalTokenMapping(targetTokenSymbol)

  if (!internalToken) return

  const chainFromName = toLowerCase(chainFrom?.name)

  const chain = internalToken.chains.find(
    i => toLowerCase(i.id) === chainFromName,
  )

  if (!chain) return

  return chain.token_address === NATIVE_TOKEN_ADDRESS
    ? tokenFromChain(chainFrom)
    : tokens.find(
        i => toLowerCase(i.address) === toLowerCase(chain.token_address),
      )
}

export const getPaymentTokensWithPairs = async (
  provider: IProvider,
  params: CheckoutOperationParams,
  tokens: Token[],
  targetToken: Token,
  chainFrom: BridgeChain,
) => {
  const paymentTokens = await getPaymentTokens(
    provider,
    chainFrom,
    await loadTokens(chainFrom),
  )

  const targetTokenSymbol = toLowerCase(targetToken.symbol)

  const paymentTokensWithoutTarget = paymentTokens.filter(
    i => toLowerCase(i.symbol) !== targetTokenSymbol,
  )

  const estimatedPrices = await Promise.allSettled(
    paymentTokensWithoutTarget.map(i =>
      estimate(provider, tokens, i, params, targetToken),
    ),
  )

  return estimatedPrices.reduce<PaymentToken[]>((acc, i) => {
    if (i.status !== 'fulfilled') return acc

    const paymentToken = paymentTokensWithoutTarget.find(
      t => toLowerCase(t.symbol) === toLowerCase(i.value.from.symbol),
    )

    if (!paymentToken) return acc

    const amountIn = i.value.from.isNative
      ? getNativeAmountIn(params, i.value.price)
      : i.value.price

    const isEnoughBalance = amountIn.isLessThanOrEqualTo(
      paymentToken.balanceRaw,
    )

    if (isEnoughBalance) acc.push(paymentToken)

    return acc
  }, [])
}

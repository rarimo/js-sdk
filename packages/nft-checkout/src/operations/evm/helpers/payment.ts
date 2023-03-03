import { BN } from '@distributedlab/utils'
import { IProvider } from '@rarimo/provider'
import {
  BalanceResult,
  getBalancesForEthereumAddress,
  Token as TokenInfo,
} from 'ethereum-erc20-token-balances-multicall'

import { Amount, PaymentToken, Token } from '@/entities'
import { BridgeChain } from '@/types'

const mapTokenBalances = (
  supportedTokens: Token[],
  balances: BalanceResult,
): PaymentToken[] => {
  if (!balances.tokens) return []

  return balances.tokens.reduce((acc, token) => {
    const paymentToken = createPaymentToken(supportedTokens, token)
    if (paymentToken) acc.push(paymentToken)
    return acc
  }, [] as PaymentToken[])
}

const getTokenByAddress = (
  tokens: Token[],
  address: string,
): Token | undefined => {
  return tokens.find(i => i.address === address)
}

const createPaymentToken = (
  supportedTokens: Token[],
  token: TokenInfo,
): PaymentToken | undefined => {
  const internalToken = getTokenByAddress(
    supportedTokens,
    token.contractAddress,
  )

  if (!internalToken) return

  const balance = new BN(token.balance)

  if (balance.compare(new BN(0)) != 1) return

  return PaymentToken.fromToken(
    internalToken,
    Amount.fromFraction(token.balance, token.decimals),
  )
}

export const getPaymentTokens = async (
  chain: BridgeChain,
  provider: IProvider,
  tokens: Token[],
): Promise<PaymentToken[]> => {
  const erc20 = mapTokenBalances(
    tokens,
    await getBalancesForEthereumAddress({
      contractAddresses: tokens.reduce((acc: string[], i) => {
        if (i.address) acc.push(i.address)
        return acc
      }, []),
      ethereumAddress: provider.address!,
      providerOptions: { ethersProvider: provider?.getWeb3Provider?.() },
    }),
  )

  const _provider = provider.getWeb3Provider?.()
  const nativeBalance = await _provider?.getBalance(provider.address!)

  return [
    ...erc20,
    ...(nativeBalance && nativeBalance.gt(0)
      ? [
          PaymentToken.fromToken(
            Token.fromChain(chain),
            Amount.fromFraction(nativeBalance.toString(), chain.token.decimals),
          ),
        ]
      : []),
  ]
}

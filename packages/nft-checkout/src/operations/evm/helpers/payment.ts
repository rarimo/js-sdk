import { BridgeChain, PaymentToken, Token } from '../../../types'
import { Amount } from '../../../entities'
import {
  BalanceResult,
  getBalancesForEthereumAddress,
  Token as TokenInfo,
} from 'ethereum-erc20-token-balances-multicall'
import { BN } from '@distributedlab/utils'
import { IProvider } from '@rarimo/provider'

const mapTokenBalances = (
  supportedTokens: Token[],
  chain: BridgeChain,
  balances: BalanceResult,
): PaymentToken[] => {
  if (!balances.tokens) return []

  return balances.tokens.reduce((acc, token) => {
    const paymentToken = createPaymentToken(supportedTokens, token, chain)
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
  chain: BridgeChain,
): PaymentToken | undefined => {
  const internalToken = getTokenByAddress(
    supportedTokens,
    token.contractAddress,
  )

  if (!internalToken) return

  const balance = new BN(token.balance)

  if (balance.compare(new BN(0)) != 1) return

  return {
    balance: balance.toString(),
    balanceRaw: Amount.fromRaw(token.balance, token.decimals),
    token: internalToken,
    chain,
  }
}

export const getPaymentTokens = async (
  chain: BridgeChain,
  provider: IProvider,
  tokens: Token[],
) => {
  const erc20 = mapTokenBalances(
    tokens,
    chain,
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
          {
            chain,
            balance: nativeBalance.toString(),
            balanceRaw: Amount.fromRaw(nativeBalance.toString(), 18),
            token: {
              address: '',
              chain,
              symbol: chain.token.symbol,
              decimals: chain.token.decimals,
              name: chain.token.name,
              logoURI: chain.icon,
            },
          },
        ]
      : []),
  ]
}

import {
  BalanceResult,
  getBalancesForEthereumAddress,
  Token as TokenInfo,
} from 'ethereum-erc20-token-balances-multicall'
import { BridgeChain, PaymentToken, Token } from '@/types'
import { BN } from '@distributedlab/utils'
import { IProvider } from '@rarimo/provider'
import { Amount } from '@/entities'

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

  if (balance.compare(new BN(0)) == -1) return

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
  return mapTokenBalances(
    tokens,
    chain,
    await getBalancesForEthereumAddress({
      contractAddresses: tokens.map(i => i.address),
      ethereumAddress: provider.address!,
      providerOptions: { ethersProvider: provider?.getWeb3Provider?.() },
    }),
  )
}

import {
  BalanceResult,
  getBalancesForEthereumAddress,
  Token as TokenInfo,
} from 'ethereum-erc20-token-balances-multicall'
import { JsonRpcProvider } from '@ethersproject/providers'
import { BridgeChain, PaymentToken, Token } from '@/types'
import { BN } from '@distributedlab/utils'

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
) => {
  const internalToken = getTokenByAddress(
    supportedTokens,
    token.contractAddress,
  )

  if (!internalToken) return

  const balance = new BN(token.balance)

  if (balance.compare(new BN(0)) == -1) return

  return {
    balance: balance.toString(),
    balanceRow: {
      value: new BN(token.balance).toFraction(token.decimals).toString(),
      decimals: token.decimals,
    },
    token: internalToken,
    chain,
  }
}

export const getPaymentTokens = async (
  chain: BridgeChain,
  ethersProvider: JsonRpcProvider,
  address: string,
  tokens: Token[],
) => {
  return mapTokenBalances(
    tokens,
    chain,
    await getBalancesForEthereumAddress({
      contractAddresses: tokens.map(i => i.address),
      ethereumAddress: address,
      providerOptions: { ethersProvider },
    }),
  )
}

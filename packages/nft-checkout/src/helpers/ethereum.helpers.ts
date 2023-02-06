import { ethers } from 'ethers'

export type EthProviderRpcError = {
  message: string
  code: number
  data?: unknown
}

export const connectEthAccounts = async (
  provider: ethers.providers.Web3Provider,
) => {
  try {
    await provider.send('eth_requestAccounts', [])
  } catch (error) {
    throw new Error(JSON.stringify(error))
  }
}

export const getEthTokenBalances = async (
  provider: ethers.providers.Web3Provider,
  accountAddress: string,
  chainId: number,
) => {
  try {
    await connectEthAccounts(provider)
    const balance = await provider.getBalance(accountAddress)
    const formattedBalance = ethers.utils.formatEther(balance)

    return [{ balance: formattedBalance, chainId: chainId }]
  } catch (error) {
    throw new Error(JSON.stringify(error))
  }
}

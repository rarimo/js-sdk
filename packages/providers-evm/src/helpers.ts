import { Chain, ChainId, errors } from '@rarimo/provider'
import { ethers, providers } from 'ethers'

import type { EthProviderRpcError } from '@/types'

export const hexToDecimal = (chainHexOrId: string | number): number => {
  if (Number.isInteger(chainHexOrId)) return Number(chainHexOrId)
  return parseInt(String(chainHexOrId), 16)
}

export const getEthExplorerTxUrl = (chain: Chain, txHash: string): string => {
  return `${chain.explorerUrl}/tx/${txHash}`
}

export const getEthExplorerAddressUrl = (
  chain: Chain,
  address: string,
): string => {
  return `${chain.explorerUrl}/address/${address}`
}

export const requestSwitchEthChain = async (
  provider: providers.Web3Provider,
  chainId: ChainId,
): Promise<void> => {
  await provider.send('wallet_switchEthereumChain', [
    { chainId: ethers.utils.hexValue(chainId) },
  ])
}

export const requestAddEthChain = async (
  provider: providers.Web3Provider,
  chainId: number,
  chainName: string,
  chainRpcUrl: string,
): Promise<void> => {
  await provider.send('wallet_addEthereumChain', [
    {
      chainId: ethers.utils.hexValue(chainId),
      chainName,
      rpcUrls: [chainRpcUrl],
    },
  ])
}

export const connectEthAccounts = async (provider: providers.Web3Provider) => {
  await provider.send('eth_requestAccounts', [])
}

export const handleEthError = (error: EthProviderRpcError): void => {
  switch (error.code) {
    case 4001:
      throw new errors.ProviderUserRejectedRequest(error)
    case 4902:
      throw new errors.ProviderChainNotFoundError(error)
    case 4100:
      throw new errors.ProviderUnauthorized(error)
    case 4200:
      throw new errors.ProviderUnsupportedMethod(error)
    case 4900:
      throw new errors.ProviderDisconnected(error)
    case 4901:
      throw new errors.ProviderChainDisconnected(error)
    case -32700:
      throw new errors.ProviderParseError(error)
    case -32600:
      throw new errors.ProviderInvalidRequest(error)
    case -32601:
      throw new errors.ProviderMethodNotFound(error)
    case -32602:
      throw new errors.ProviderInvalidParams(error)
    case -32603:
      throw new errors.ProviderInternalError(error)
    case -32000:
      throw new errors.ProviderInvalidInput(error)
    case -32001:
      throw new errors.ProviderResourceNotFound(error)
    case -32002:
      throw new errors.ProviderResourceUnavailable(error)
    case -32003:
      throw new errors.ProviderTransactionRejected(error)
    case -32004:
      throw new errors.ProviderMethodNotSupported(error)
    case -32005:
      throw new errors.ProviderLimitExceeded(error)
    case -32006:
      throw new errors.ProviderJsonRpcVersionNotSupported(error)
    default:
      throw error
  }
}

export const wrapExternalEthProvider = (
  provider: providers.ExternalProvider,
) => {
  const _baseRequest = provider.request?.bind(provider)

  provider.request = async (request: {
    method: string
    params?: Array<unknown>
  }) => {
    let result: unknown

    try {
      result = await _baseRequest?.(request)
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }

    return result
  }

  return provider
}

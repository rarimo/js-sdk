import { errors } from '@rarimo/provider'
import type { Chain, ChainId } from '@rarimo/shared'
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

export const handleEthError = (e: EthProviderRpcError): never => {
  switch (e.code) {
    case 4001:
      throw new errors.ProviderUserRejectedRequest(e)
    case 4902:
      throw new errors.ProviderChainNotFoundError(e)
    case 4100:
      throw new errors.ProviderUnauthorized(e)
    case 4200:
      throw new errors.ProviderUnsupportedMethod(e)
    case 4900:
      throw new errors.ProviderDisconnected(e)
    case 4901:
      throw new errors.ProviderChainDisconnected(e)
    case -32700:
      throw new errors.ProviderParseError(e)
    case -32600:
      throw new errors.ProviderInvalidRequest(e)
    case -32601:
      throw new errors.ProviderMethodNotFound(e)
    case -32602:
      throw new errors.ProviderInvalidParams(e)
    case -32603:
      throw new errors.ProviderInternalError(e)
    case -32000:
      throw new errors.ProviderInvalidInput(e)
    case -32001:
      throw new errors.ProviderResourceNotFound(e)
    case -32002:
      throw new errors.ProviderResourceUnavailable(e)
    case -32003:
      throw new errors.ProviderTransactionRejected(e)
    case -32004:
      throw new errors.ProviderMethodNotSupported(e)
    case -32005:
      throw new errors.ProviderLimitExceeded(e)
    case -32006:
      throw new errors.ProviderJsonRpcVersionNotSupported(e)
    default:
      throw e
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

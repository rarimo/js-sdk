import { errors } from '@/errors'
import Web3 from 'web3/types'
import { Chain, ChainId, EthereumProvider, EthProviderRpcError } from '@/types'

export const detectCurrentEthChain = async (web3: Web3): Promise<number> => {
  return web3.eth.net.getId()
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
  provider: EthereumProvider,
  chainId: ChainId,
): Promise<void> => {
  await provider.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: window.Web3.utils.toHex(chainId) }],
  })
}

export const requestAddEthChain = async (
  provider: EthereumProvider,
  chain: Chain,
): Promise<void> => {
  await provider.request({
    method: 'wallet_addEthereumChain',
    params: [
      {
        chainId: window.Web3.utils.toHex(chain.id),
        chainName: chain.name,
        rpcUrls: [chain.rpcUrl],
      },
    ],
  })
}

export const connectEthProvider = async (
  provider: EthereumProvider,
): Promise<void> => {
  await provider.request({
    method: 'eth_requestAccounts',
  })
}

export function handleEthError(error: EthProviderRpcError): void {
  switch (error.code) {
    case 4001:
      throw new errors.ProviderUserRejectedRequest()
    case 4100:
      throw new errors.ProviderUnauthorized()
    case 4200:
      throw new errors.ProviderUnsupportedMethod()
    case 4900:
      throw new errors.ProviderDisconnected()
    case 4901:
      throw new errors.ProviderChainDisconnected()
    case -32700:
      throw new errors.ProviderParseError()
    case -32600:
      throw new errors.ProviderInvalidRequest()
    case -32601:
      throw new errors.ProviderMethodNotFound()
    case -32602:
      throw new errors.ProviderInvalidParams()
    case -32603:
      throw new errors.ProviderInternalError()
    case -32000:
      throw new errors.ProviderInvalidInput()
    case -32001:
      throw new errors.ProviderResourceNotFound()
    case -32002:
      throw new errors.ProviderResourceUnavailable()
    case -32003:
      throw new errors.ProviderTransactionRejected()
    case -32004:
      throw new errors.ProviderMethodNotSupported()
    case -32005:
      throw new errors.ProviderLimitExceeded()
    case -32006:
      throw new errors.ProviderJsonRpcVersionNotSupported()
    default:
      throw error
  }
}

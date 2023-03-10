import { Transaction } from '@solana/web3.js'
import bs58 from 'bs58'

import { EIP1193, EIP1474, SolanaChains } from '@/enums'
import { errors } from '@/errors'
import { Chain, SolanaProviderRpcError } from '@/types'

export function handleSolError(error: SolanaProviderRpcError) {
  const ErrorCode = error?.error?.code || error?.code

  switch (ErrorCode) {
    case EIP1193.userRejectedRequest:
      throw new errors.ProviderUserRejectedRequest()
    case EIP1193.unauthorized:
      throw new errors.ProviderUnauthorized()
    case EIP1193.unsupportedMethod:
      throw new errors.ProviderUnsupportedMethod()
    case EIP1193.disconnected:
      throw new errors.ProviderDisconnected()
    case EIP1193.chainDisconnected:
      throw new errors.ProviderChainDisconnected()
    case EIP1474.parseError:
      throw new errors.ProviderParseError()
    case EIP1474.invalidRequest:
      throw new errors.ProviderInvalidRequest()
    case EIP1474.methodNotFound:
      throw new errors.ProviderMethodNotFound()
    case EIP1474.invalidParams:
      throw new errors.ProviderInvalidParams()
    case EIP1474.internalError:
      throw new errors.ProviderInternalError()
    case EIP1474.invalidInput:
      throw new errors.ProviderInvalidInput()
    case EIP1474.resourceNotFound:
      throw new errors.ProviderResourceNotFound()
    case EIP1474.resourceUnavailable:
      throw new errors.ProviderResourceUnavailable()
    case EIP1474.transactionRejected:
      throw new errors.ProviderTransactionRejected()
    case EIP1474.methodNotSupported:
      throw new errors.ProviderMethodNotSupported()
    case EIP1474.limitExceeded:
      throw new errors.ProviderLimitExceeded()
    case EIP1474.jsonRpcVersionNotSupported:
      throw new errors.ProviderJsonRpcVersionNotSupported()
    default:
      throw error
  }
}

export function decodeSolanaTx(tx: string) {
  const buff = bs58.decode(tx)
  return Transaction.from(buff)
}

export function getSolExplorerTxUrl(chain: Chain, txHash: string) {
  const url = `${chain.explorerUrl}/tx/${txHash}`
  return chain.id === SolanaChains.MainNet ? url : `${url}?cluster=${chain.id}`
}

export function getSolExplorerAddressUrl(chain: Chain, address: string) {
  const url = `${chain.explorerUrl}/address/${address}`
  return chain.id === SolanaChains.MainNet ? url : `${url}?cluster=${chain.id}`
}

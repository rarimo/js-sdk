import { errors } from '@rarimo/provider'
import type { Chain } from '@rarimo/shared'
import { ChainNames, SOLANA_CHAIN_IDS } from '@rarimo/shared'
import { Transaction } from '@solana/web3.js'
import bs58 from 'bs58'

import type { SolanaProviderRpcError } from '@/types'

export function handleSolError(error: SolanaProviderRpcError) {
  const ErrorCode = error?.error?.code || error?.code

  switch (ErrorCode) {
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

export function decodeSolanaTx(tx: string) {
  const buff = bs58.decode(tx)
  return Transaction.from(buff)
}

export function getSolExplorerTxUrl(chain: Chain, txHash: string) {
  const url = `${chain.explorerUrl}/tx/${txHash}`
  return chain.id === SOLANA_CHAIN_IDS[ChainNames.SolanaMainNet]
    ? url
    : `${url}?cluster=${chain.id}`
}

export function getSolExplorerAddressUrl(chain: Chain, address: string) {
  const url = `${chain.explorerUrl}/address/${address}`
  return chain.id === SOLANA_CHAIN_IDS[ChainNames.SolanaMainNet]
    ? url
    : `${url}?cluster=${chain.id}`
}

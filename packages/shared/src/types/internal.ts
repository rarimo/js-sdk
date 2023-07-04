import type { JsonApiRecordBase } from '@distributedlab/jac'

import { ChainKind, ChainTypes, EVMDexType } from '@/enums'

import type { ChainId } from './chain'
import type { Address, Decimals, HexString, TokenSymbol } from './common'

export type InternalBridgeChainType = {
  name: string
  value: ChainTypes
}

export type InternalBridgeChainKind = {
  name: ChainKind
  value: number
}

export type InternalBridgeChain = {
  id: ChainId
  name: string
  type: InternalBridgeChainType
  kind: InternalBridgeChainKind
  rpc: string
  explorer_url: string
  icon: string
  swap_contract_address: Address
  swap_contract_version: EVMDexType
  native_token: {
    symbol: TokenSymbol
    name: string
    decimals: Decimals
  }
}

export enum DestinationTransactionStatus {
  Success = 'success',
  Failed = 'failed',
}

export type DestinationTransaction = {
  hash: string
  status: DestinationTransactionStatus
}

export type DestinationTransactionResponse =
  JsonApiRecordBase<'destination_transaction'> & {
    status: DestinationTransactionStatus
  }

export type InternalAccountBalance = JsonApiRecordBase<'balances'> & {
  amount: string
  chain: InternalBridgeChain
  token: InternalSupportedTokenKey
  owner: InternalAccountKey
}

export type InternalSupportedTokenKey = JsonApiRecordBase<'tokens'>
export type InternalAccountKey = JsonApiRecordBase<'accounts'>

export type InternalSupportedToken = InternalSupportedTokenKey & {
  name: string
  symbol: TokenSymbol
  decimals: Decimals
  logo_uri: string
  native: boolean
}

export type InternalTokenId = [ChainId, HexString]

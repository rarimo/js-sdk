import type { NetworkParamType, NetworkType, TokenType } from '@/enums'

export type Network = {
  /** network name */
  name: string
  type: NetworkType
  params: NetworkParams[]
}

export type NetworkParams = {
  type: NetworkParamType
  /** Corresponding to type details */
  details?: BridgeNetworkParams | FeeNetworkParams | IdentityNetworkParams
}

export type BridgeNetworkParams = {
  contract: string
  /** BridgeAdmin only for Solana */
  admin: string
}

export type FeeNetworkParams = {
  contract: string
  feeTokens: FeeToken[]
}

export type IdentityNetworkParams = {
  contract: string
}

export type FeeToken = {
  /** contract address hex */
  contract: string
  amount: string
}

export type CollectionMetadata = {
  name: string
  symbol: string
  metadata_uri: string
}

export type CollectionDataIndex = {
  /** Chain name */
  chain: string
  /** Collection contract address */
  address: string
}

export type CollectionData = {
  index?: CollectionDataIndex
  collection: string
  token_type: TokenType
  wrapped: boolean
  decimals: number
}

export type Collection = {
  index: string
  meta?: CollectionMetadata
  data: CollectionDataIndex[]
}

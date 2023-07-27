import { NetworkParamType, NetworkType, TokenType, UpgradeType } from '@/enums'

export type FeeToken = {
  /** contract address hex */
  contract: string
  amount: string
}

export type Network = {
  /** network name */
  name: string
  type: NetworkType
  params: NetworkParams[]
}

export type BridgeNetworkParams = {
  contract: string
}

export type FeeNetworkParams = {
  contract: string
  feeTokens: FeeToken[]
}

export type IdentityNetworkParams = {
  contract: string
}

export type NetworkParams = {
  type: NetworkParamType
  /** Corresponding to type details */
  details?: BridgeNetworkParams | FeeNetworkParams | IdentityNetworkParams
}

export type ItemMetadata = {
  imageUri: string
  /** Hash of the token image. Encoded into hex string. (optional) */
  imageHash: string
  /** Seed is used to generate PDA address for Solana */
  seed: string
  uri: string
}

export type Seed = {
  /** index */
  seed: string
  item: string
}

export type Item = {
  index: string
  collection: string
  meta: ItemMetadata | undefined
  onChain: OnChainItemIndex[]
}

export type OnChainItemIndex = {
  chain: string
  address: string
  tokenID: string
}

export type OnChainItem = {
  index: OnChainItemIndex | undefined
  item: string
}

export type ContractUpgradeDetails = {
  /** Target contract address upgrade to */
  targetContract: string
  /** New contract address: used on EVM */
  newImplementationContract: string
  /** byte code hash: used on Solana and Near */
  hash: string
  /** Solana buffer account */
  bufferAccount: string
  /** chain name according to stored in tokenmanager params */
  chain: string
  /** dec nonce */
  nonce: string
  type: UpgradeType
}

export type CollectionMetadata = {
  name: string
  symbol: string
  metadata_uri: string
}

export type CollectionDataIndex = {
  chain: string
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

export type UpgradeContractProposal = {
  title: string
  description: string
  details: ContractUpgradeDetails | undefined
}

export type AddNetworkProposal = {
  title: string
  description: string
  network: Network | undefined
}

export type RemoveNetworkProposal = {
  title: string
  description: string
  chain: string
}

export type AddFeeTokenProposal = {
  title: string
  description: string
  chain: string
  nonce: string
  token: FeeToken | undefined
}

export type UpdateFeeTokenProposal = {
  title: string
  description: string
  chain: string
  nonce: string
  token: FeeToken | undefined
}

export type RemoveFeeTokenProposal = {
  title: string
  description: string
  chain: string
  contract: string
  nonce: string
}

export type WithdrawFeeProposal = {
  title: string
  description: string
  chain: string
  token: FeeToken | undefined
  receiver: string
  nonce: string
}

export type UpdateTokenItemProposal = {
  title: string
  description: string
  item: Item[]
}

export type RemoveTokenItemProposal = {
  title: string
  description: string
  index: string[]
}

export type CreateCollectionProposal = {
  title: string
  description: string
  index: string
  metadata: CollectionMetadata | undefined
  /** All supported networks described */
  data: CollectionData[]
  item: Item[]
  onChainItem: OnChainItem[]
}

export type UpdateCollectionDataProposal = {
  title: string
  description: string
  data: CollectionData[]
}

export type AddCollectionDataProposal = {
  title: string
  description: string
  data: CollectionData[]
}

export type RemoveCollectionDataProposal = {
  title: string
  description: string
  index: CollectionDataIndex[]
}

export type RemoveCollectionProposal = {
  title: string
  description: string
  index: string
}

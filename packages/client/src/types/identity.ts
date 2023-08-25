export type MerkleProof = {
  proof: string[]
}

export type StateInfo = {
  index: string
  hash: string
  createdAtTimestamp: string
  lastUpdateOperationIndex: string
}

export type GetStateInfoResponse = {
  state: StateInfo
}

export type IdentityNode = {
  node: {
    key: string
    priority: string
    left: string
    right: string
    hash: string
    childrenHash: string
  }
}

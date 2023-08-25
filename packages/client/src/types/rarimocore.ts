import type { OperationStatus } from '@/enums'

export type OperationProof = {
  path: string[]
  signature: string
}

export type Operation = {
  index: string
  operationType: string
  details: {
    '@type': string
    contract: string
    chain: string
    GISTHash: string
    stateRootHash: string
    timestamp: string
  }
  status: OperationStatus
  creator: string
  timestamp: string
}

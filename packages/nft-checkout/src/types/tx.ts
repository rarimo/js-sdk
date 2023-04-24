import type { JsonApiRecordBase } from '@distributedlab/jac'

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

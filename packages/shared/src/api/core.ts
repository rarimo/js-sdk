import { HTTP_STATUS_CODES, JsonApiError } from '@distributedlab/jac'

import { RuntimeError } from '@/entities'
import { sleep } from '@/helpers'
import type {
  BridgeChain,
  ChainId,
  DestinationTransaction,
  DestinationTransactionResponse,
  HexString,
} from '@/types'

import { coreApi } from './api'

const DESTINATION_TX_PULL_INTERVAL = 2000
const DESTINATION_TX_PULL_MAX_RETRIES = 20
const pullError = new RuntimeError(
  'Failed to fetch destination transaction chain',
)

export const getDestinationTx = async (
  sourceChain: BridgeChain,
  sourceTxHash: HexString,
): Promise<DestinationTransaction> => {
  let retries = 0
  let transaction: DestinationTransactionResponse | null = null

  while (!transaction) {
    retries += 1
    if (retries > DESTINATION_TX_PULL_MAX_RETRIES) throw pullError
    transaction = await fetchDestinationTx(sourceChain.name, sourceTxHash)
    if (!transaction) await sleep(DESTINATION_TX_PULL_INTERVAL)
  }

  return {
    hash: transaction.id,
    status: transaction.status,
  }
}

const fetchDestinationTx = async (
  chainId: ChainId,
  txHash: HexString,
): Promise<DestinationTransactionResponse | null> => {
  try {
    const { data } = await coreApi.get<DestinationTransactionResponse>(
      `/v1/chains/${chainId}/transactions/${txHash}`,
    )
    return data
  } catch (e) {
    const status = (e as JsonApiError).httpStatus
    if (status === HTTP_STATUS_CODES.NOT_FOUND) return null
    throw e
  }
}

import {
  HTTP_STATUS_CODES,
  JsonApiClient,
  JsonApiError,
} from '@distributedlab/jac'
import { BridgeChain, ChainId, HexString, sleep } from '@rarimo/shared'

import { CONFIG } from '@/config'
import type {
  DestinationTransaction,
  DestinationTransactionResponse,
} from '@/types'

const DESTINATION_TX_PULL_INTERVAL = 2000

const api = new JsonApiClient({
  baseUrl: CONFIG.CORE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Origin: window?.origin ?? '',
  },
  credentials: 'omit',
})

export const getDestinationTx = async (
  sourceChain: BridgeChain,
  sourceTxHash: HexString,
): Promise<DestinationTransaction> => {
  let transaction: DestinationTransactionResponse | undefined

  while (!transaction) {
    transaction = await fetchDestinationTx(sourceChain.name, sourceTxHash)
    if (!transaction) {
      await sleep(DESTINATION_TX_PULL_INTERVAL)
    }
  }

  return {
    hash: transaction!.id,
    status: transaction!.status,
  }
}

const fetchDestinationTx = async (
  chainId: ChainId,
  txHash: HexString,
): Promise<DestinationTransactionResponse | undefined> => {
  try {
    const { data } = await api.get<DestinationTransactionResponse>(
      `/v1/chains/${chainId}/transactions/${txHash}`,
    )
    return data
  } catch (e) {
    if ((e as JsonApiError).httpStatus === HTTP_STATUS_CODES.NOT_FOUND) {
      return undefined
    }

    throw e
  }
}

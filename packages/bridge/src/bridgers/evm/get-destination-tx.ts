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
  InternalToken,
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
  let transaction: DestinationTransactionResponse | null = null

  while (!transaction) {
    transaction = await fetchDestinationTx(sourceChain.name, sourceTxHash)
    if (!transaction) {
      await sleep(DESTINATION_TX_PULL_INTERVAL)
    }
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
    const { data } = await api.get<DestinationTransactionResponse>(
      `/v1/chains/${chainId}/transactions/${txHash}`,
    )
    return data
  } catch (e) {
    if ((e as JsonApiError).httpStatus === HTTP_STATUS_CODES.NOT_FOUND) {
      return null
    }

    throw e
  }
}

export const fetchInternalTokenMapping = async (
  targetTokenSymbol: string,
): Promise<InternalToken | undefined> => {
  let result: InternalToken | undefined
  try {
    const { data } = await api.get<InternalToken>(
      `/v1/tokens/${targetTokenSymbol}`,
    )
    result = data
  } catch (e) {
    if ((e as JsonApiError).httpStatus === HTTP_STATUS_CODES.NOT_FOUND) {
      return
    }
    console.error(e)
  }

  return result
}

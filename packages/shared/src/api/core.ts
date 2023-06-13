import { HTTP_STATUS_CODES, JsonApiError } from '@distributedlab/jac'

import { sleep } from '@/helpers'
import type {
  BridgeChain,
  ChainId,
  DestinationTransaction,
  DestinationTransactionResponse,
  HexString,
  InternalToken,
} from '@/types'

import { coreApi } from './api'

const DESTINATION_TX_PULL_INTERVAL = 2000

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
    const { data } = await coreApi.get<DestinationTransactionResponse>(
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
    const { data } = await coreApi.get<InternalToken>(
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

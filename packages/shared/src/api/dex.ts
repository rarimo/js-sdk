import { ChainKind, ChainNames, ChainTypes } from '@/enums'
import { isUndefined } from '@/helpers'
import type {
  BridgeChain,
  HexString,
  InternalAccountBalance,
  InternalBridgeChain,
  InternalSupportedToken,
} from '@/types'

import { CONFIG, dexApi, loadAllPagesData } from './api'

export const getSupportedChains = async ({
  type,
  kind,
}: { type?: ChainTypes; kind?: ChainKind } = {}): Promise<BridgeChain[]> => {
  const { data } = await dexApi.get<InternalBridgeChain[]>('/chains', {
    query: {
      ...(!isUndefined(type) && { 'filter[type]': type }),
      ...(kind && { 'filter[kind]': kind }),
    },
  })

  if (!data.length) return []

  return data.map(chain => ({
    id: Number(chain.id),
    name: chain.name as ChainNames,
    rpcUrl: chain.rpc,
    explorerUrl: chain.explorer_url,
    type: chain.type.value,
    icon: chain.icon,
    isTestnet: chain.kind.name === ChainKind.Testnet,
    contractAddress: chain.swap_contract_address,
    dexType: chain.swap_contract_version,
    token: {
      ...chain.native_token,
    },
  }))
}

export const getAccountBalances = async (
  chain: BridgeChain,
  accountAddress: HexString,
): Promise<InternalAccountBalance[]> => {
  const endpoint = `/chains/evm/${chain.name}/${accountAddress}/balances`
  const response = await dexApi.get<InternalAccountBalance[]>(endpoint, {
    query: {
      page: {
        limit: CONFIG.MAX_PAGE_LIMIT,
      },
    },
  })
  return loadAllPagesData(response)
}

export const getSupportedTokens = async (
  chain: BridgeChain,
): Promise<InternalSupportedToken[]> => {
  const endpoint = `/chains/evm/${chain.name}/tokens`
  const response = await dexApi.get<InternalSupportedToken[]>(endpoint, {
    query: {
      page: {
        limit: CONFIG.MAX_PAGE_LIMIT,
      },
    },
  })
  return loadAllPagesData(response)
}

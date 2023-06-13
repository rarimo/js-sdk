import { ChainKind, ChainNames, ChainTypes } from '@/enums'
import { isUndefined } from '@/helpers'
import type {
  BridgeChain,
  HexString,
  InternalAccountBalance,
  InternalBridgeChain,
  InternalSupportedToken,
} from '@/types'

import { dexApi, loadAllPagesData } from './api'

export const loadSupportedChains = async ({
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

export const loadAccountBalances = async (
  chain: BridgeChain,
  accountAddress: HexString,
): Promise<InternalAccountBalance[]> => {
  const endpoint = `/chains/evm/${chain.name}/${accountAddress}/balances`
  const response = await dexApi.get<InternalAccountBalance[]>(endpoint)
  return loadAllPagesData(response)
}

export const loadSupportedTokens = async (
  chain: BridgeChain,
): Promise<InternalSupportedToken[]> => {
  const endpoint = `/chains/evm/${chain.name}/tokens`
  const { data } = await dexApi.get<InternalSupportedToken[]>(endpoint)
  return data
}

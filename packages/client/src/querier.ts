import { Fetcher } from '@distributedlab/fetcher'

import type {
  Account,
  Coin,
  Config,
  DelegationResponse,
  GovParams,
  NodeInfo,
  Proposal,
  RarimoQuerier,
} from '@/types'

export const makeQuerier = async (config: Config): Promise<RarimoQuerier> => {
  const api = new Fetcher({
    baseUrl: config.apiUrl,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const getNodeStatus = async () => {
    const { data } = await api.get<NodeInfo>(
      '/cosmos/base/tendermint/v1beta1/node_info',
    )
    return data as NodeInfo
  }

  const getAccount = async (address: string) => {
    const { data } = await api.get<Account>(
      `/cosmos/auth/v1beta1/accounts/${address}`,
    )
    return (data as Account) ?? null
  }

  const getAllBalances = async (address: string) => {
    const { data } = await api.get<{
      balances: Coin[]
    }>(`/cosmos/bank/v1beta1/balances/${address}`)
    return data?.balances ?? []
  }

  const getDelegation = async (delegator: string, validator: string) => {
    const endpoint = `/cosmos/staking/v1beta1/validators/${validator}/delegations/${delegator}`
    const { data } = await api.get<DelegationResponse>(endpoint)
    return data as DelegationResponse
  }

  const getDelegationRewards = async (delegator: string, validator: string) => {
    const endpoint = `/cosmos/distribution/v1beta1/delegators/${delegator}/rewards/${validator}`
    const { data } = await api.get<{
      rewards: Coin[]
    }>(endpoint)
    return (data?.rewards ?? []) as Coin[]
  }

  const getGovParams = async (paramType: string) => {
    const endpoint = `/cosmos/gov/v1beta1/params/${paramType}`
    const { data } = await api.get<GovParams>(endpoint)
    return data as GovParams
  }

  const getProposal = async (proposalId: number) => {
    const endpoint = `/cosmos/gov/v1beta1/proposals/${proposalId}`
    const { data } = await api.get<{ proposal: Proposal }>(endpoint)
    return data?.proposal as Proposal
  }

  return {
    getNodeStatus,
    getAccount,
    getAllBalances,
    getDelegation,
    getDelegationRewards,
    getGovParams,
    getProposal,
  }
}

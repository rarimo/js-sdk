import { Fetcher } from '@distributedlab/fetcher'

import type {
  Account,
  Coin,
  Config,
  DelegationResponse,
  GetStateInfoResponse,
  GovParams,
  IdentityNode,
  IdentityParams,
  MerkleProof,
  NodeInfo,
  OperationProof,
  Proposal,
  RarimoQuerier,
} from '@/types'

export const makeRarimoQuerier = (
  config: Pick<Config, 'apiUrl'>,
): RarimoQuerier => {
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
    return data!
  }

  const getAccount = async (address: string) => {
    const { data } = await api.get<Account>(
      `/cosmos/auth/v1beta1/accounts/${address}`,
    )
    return data!
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
    return data!
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
    return data!
  }

  const getProposal = async (proposalId: number) => {
    const endpoint = `/cosmos/gov/v1beta1/proposals/${proposalId}`
    const { data } = await api.get<{ proposal: Proposal }>(endpoint)
    return data!.proposal
  }

  const getMerkleProof = async (id: string) => {
    const endpoint = `/rarimo/rarimo-core/identity/state/${id}/proof`
    const { data } = await api.get<MerkleProof>(endpoint)
    return data!
  }

  const getState = async (id: string) => {
    const endpoint = `/rarimo/rarimo-core/identity/state/${id}`
    const { data } = await api.get<GetStateInfoResponse>(endpoint)
    return data!.state
  }

  const getOperationProof = async (index: string) => {
    const endpoint = `/rarimo/rarimo-core/rarimo-core/operation/${index}/proof`
    const { data } = await api.get<OperationProof>(endpoint)
    return data!
  }

  const getIdentityParams = async () => {
    const endpoint = '/rarimo/rarimo-core/identity/params'
    const { data } = await api.get<IdentityParams>(endpoint)

    return data!
  }

  const getIdentityNodeByKey = async (key: string) => {
    const endpoint = `/rarimo/rarimo-core/identity/node/${key}`
    const { data } = await api.get<IdentityNode>(endpoint)

    return data!
  }

  return {
    getNodeStatus,
    getAccount,
    getAllBalances,
    getDelegation,
    getDelegationRewards,
    getGovParams,
    getProposal,
    getMerkleProof,
    getState,
    getOperationProof,
    getIdentityParams,
    getIdentityNodeByKey,
  }
}

import { Fetcher } from '@distributedlab/fetcher'

import { buildRarimoQuerierOpts } from '@/helpers'
import type {
  Account,
  Coin,
  Config,
  CosmosRequestContext,
  DelegationResponse,
  GetStateInfoResponse,
  GovParams,
  IdentityNode,
  MerkleProof,
  NodeInfo,
  Operation,
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

  const getNodeStatus = async (cosmosRequestContext?: CosmosRequestContext) => {
    const { data } = await api.get<NodeInfo>(
      '/cosmos/base/tendermint/v1beta1/node_info',
      buildRarimoQuerierOpts(cosmosRequestContext),
    )
    return data!
  }

  const getAccount = async (
    address: string,
    cosmosRequestContext?: CosmosRequestContext,
  ) => {
    const { data } = await api.get<{ account: Account }>(
      `/cosmos/auth/v1beta1/accounts/${address}`,
      buildRarimoQuerierOpts(cosmosRequestContext),
    )
    return data!.account
  }

  const getAllBalances = async (
    address: string,
    cosmosRequestContext?: CosmosRequestContext,
  ) => {
    const { data } = await api.get<{
      balances: Coin[]
    }>(
      `/cosmos/bank/v1beta1/balances/${address}`,
      buildRarimoQuerierOpts(cosmosRequestContext),
    )
    return data?.balances ?? []
  }

  const getDelegation = async (
    delegator: string,
    validator: string,
    cosmosRequestContext?: CosmosRequestContext,
  ) => {
    const endpoint = `/cosmos/staking/v1beta1/validators/${validator}/delegations/${delegator}`
    const { data } = await api.get<DelegationResponse>(
      endpoint,
      buildRarimoQuerierOpts(cosmosRequestContext),
    )
    return data!
  }

  const getDelegationRewards = async (
    delegator: string,
    validator: string,
    cosmosRequestContext?: CosmosRequestContext,
  ) => {
    const endpoint = `/cosmos/distribution/v1beta1/delegators/${delegator}/rewards/${validator}`
    const { data } = await api.get<{
      rewards: Coin[]
    }>(endpoint, buildRarimoQuerierOpts(cosmosRequestContext))
    return (data?.rewards ?? []) as Coin[]
  }

  const getGovParams = async (
    paramType: string,
    cosmosRequestContext?: CosmosRequestContext,
  ) => {
    const endpoint = `/cosmos/gov/v1beta1/params/${paramType}`
    const { data } = await api.get<GovParams>(
      endpoint,
      buildRarimoQuerierOpts(cosmosRequestContext),
    )
    return data!
  }

  const getProposal = async (
    proposalId: number,
    cosmosRequestContext?: CosmosRequestContext,
  ) => {
    const endpoint = `/cosmos/gov/v1beta1/proposals/${proposalId}`
    const { data } = await api.get<{ proposal: Proposal }>(
      endpoint,
      buildRarimoQuerierOpts(cosmosRequestContext),
    )
    return data!.proposal
  }

  const getMerkleProof = async (
    id: string,
    cosmosRequestContext?: CosmosRequestContext,
  ) => {
    const endpoint = `/rarimo/rarimo-core/identity/state/${id}/proof`
    const { data } = await api.get<MerkleProof>(
      endpoint,
      buildRarimoQuerierOpts(cosmosRequestContext),
    )
    return data!
  }

  const getState = async (
    id: string,
    cosmosRequestContext?: CosmosRequestContext,
  ) => {
    const endpoint = `/rarimo/rarimo-core/identity/state/${id}`
    const { data } = await api.get<GetStateInfoResponse>(
      endpoint,
      buildRarimoQuerierOpts(cosmosRequestContext),
    )
    return data!.state
  }

  const getOperationProof = async (
    index: string,
    cosmosRequestContext?: CosmosRequestContext,
  ) => {
    const endpoint = `/rarimo/rarimo-core/rarimocore/operation/${index}/proof`
    const { data } = await api.get<OperationProof>(
      endpoint,
      buildRarimoQuerierOpts(cosmosRequestContext),
    )
    return data!
  }

  const getOperation = async (
    index: string,
    cosmosRequestContext?: CosmosRequestContext,
  ) => {
    const endpoint = `/rarimo/rarimo-core/rarimocore/operation/${index}`
    const { data } = await api.get<{ operation: Operation }>(
      endpoint,
      buildRarimoQuerierOpts(cosmosRequestContext),
    )

    return data!.operation!
  }

  const getIdentityNodeByKey = async (
    key: string,
    cosmosRequestContext?: CosmosRequestContext,
  ) => {
    const endpoint = `/rarimo/rarimo-core/identity/node/${key}`
    const { data } = await api.get<IdentityNode>(
      endpoint,
      buildRarimoQuerierOpts(cosmosRequestContext),
    )

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
    getOperation,
    getIdentityNodeByKey,
  }
}

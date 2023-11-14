import type { OfflineSigner } from '@cosmjs/proto-signing'
import type { GovParamsType } from '@cosmjs/stargate'
import type { AccountData, ChainInfo } from '@keplr-wallet/types'

import type { GrantAuthorization } from '@/types/authz'

import type { Account } from './auth'
import type { Coin } from './bank'
import type { RarimoBroadcaster } from './broadcaster'
import type { Config } from './config'
import type { GovParams, Proposal } from './gov'
import type { IdentityNode, MerkleProof, StateInfo } from './identity'
import type { Operation, OperationProof } from './rarimocore'
import type { DelegationResponse } from './staking'
import type { NodeInfo } from './tendermint'

export interface Wallet {
  readonly signer: OfflineSigner
  readonly accounts: readonly AccountData[]
  readonly account: AccountData
  readonly address: string
  readonly chainId: string
  readonly isEmpty: boolean
  connect: (chainInfo: ChainInfo) => Promise<void>
  disconnect: () => void
}

export type CosmosRequestContext = {
  blockHeight: string
}

export type RarimoQuerier = {
  // tendermint
  getNodeStatus(cosmosRequestContext?: CosmosRequestContext): Promise<NodeInfo>
  // auth
  getAccount(
    address: string,
    cosmosRequestContext?: CosmosRequestContext,
  ): Promise<Account>
  // authz
  getGrantAuthorizationsByGrantee(
    grantee: string,
    cosmosRequestContext?: CosmosRequestContext,
  ): Promise<GrantAuthorization[]>
  // bank
  getAllBalances(
    address: string,
    cosmosRequestContext?: CosmosRequestContext,
  ): Promise<Coin[]>
  // gov
  getGovParams(
    paramType: GovParamsType,
    cosmosRequestContext?: CosmosRequestContext,
  ): Promise<GovParams>
  getProposal(
    proposalId: number,
    cosmosRequestContext?: CosmosRequestContext,
  ): Promise<Proposal>
  // staking
  getDelegation(
    delegator: string,
    validator: string,
    cosmosRequestContext?: CosmosRequestContext,
  ): Promise<DelegationResponse>
  // distribution
  getDelegationRewards(
    delegator: string,
    validator: string,
    cosmosRequestContext?: CosmosRequestContext,
  ): Promise<Coin[]>
  // rarimocore/identity
  getMerkleProof(
    id: string,
    cosmosRequestContext?: CosmosRequestContext,
  ): Promise<MerkleProof>
  getState(
    id: string,
    cosmosRequestContext?: CosmosRequestContext,
  ): Promise<StateInfo>
  // rarimocore/rarimocore
  getOperationProof(
    index: string,
    cosmosRequestContext?: CosmosRequestContext,
  ): Promise<OperationProof>
  getOperation(
    index: string,
    cosmosRequestContext?: CosmosRequestContext,
  ): Promise<Operation>
  getIdentityNodeByKey(
    key: string,
    cosmosRequestContext?: CosmosRequestContext,
  ): Promise<IdentityNode>
}

export type RarimoClient = {
  config: Config
  wallet: Wallet
  query: RarimoQuerier
  tx: RarimoBroadcaster
  connect: () => Promise<void>
  disconnect: () => void
}

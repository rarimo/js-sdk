import type { OfflineSigner } from '@cosmjs/proto-signing'
import type { GovParamsType } from '@cosmjs/stargate'
import type { AccountData, ChainInfo } from '@keplr-wallet/types'

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

export type RarimoQuerier = {
  // tendermint
  getNodeStatus(): Promise<NodeInfo>
  // auth
  getAccount(address: string): Promise<Account>
  // bank
  getAllBalances(address: string): Promise<Coin[]>
  // gov
  getGovParams(paramType: GovParamsType): Promise<GovParams>
  getProposal(proposalId: number): Promise<Proposal>
  // staking
  getDelegation(
    delegator: string,
    validator: string,
  ): Promise<DelegationResponse>
  // distribution
  getDelegationRewards(delegator: string, validator: string): Promise<Coin[]>
  // rarimocore/identity
  getMerkleProof(id: string): Promise<MerkleProof>
  getState(id: string): Promise<StateInfo>
  // rarimocore/rarimocore
  getOperationProof(index: string): Promise<OperationProof>
  getOperation(index: string): Promise<Operation>
  getIdentityNodeByKey(key: string): Promise<IdentityNode>
}

export type RarimoClient = {
  config: Config
  wallet: Wallet
  query: RarimoQuerier
  tx: RarimoBroadcaster
  connect: () => Promise<void>
  disconnect: () => void
}

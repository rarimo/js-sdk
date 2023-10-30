import type { DeliverTxResponse } from '@cosmjs/stargate'

import { Coin } from '@/codec/cosmos/base/v1beta1/coin'
import { Any } from '@/codec/google/protobuf/any'
import { VoteOption } from '@/enums'

export type RarimoBroadcaster = {
  disconnect: () => void

  // authz
  exec(grantee: string, msgs: Any[]): Promise<DeliverTxResponse>

  execDelegate(
    grantee: string,
    delegatorAddress: string,
    validatorAddress: string,
    amount?: Coin,
  ): Promise<DeliverTxResponse>

  execUndelegate: (
    grantee: string,
    delegatorAddress: string,
    validatorAddress: string,
    amount?: Coin,
  ) => Promise<DeliverTxResponse>

  execVoteProposal: (
    grantee: string,
    voter: string,
    proposalId: number,
    option: VoteOption,
  ) => Promise<DeliverTxResponse>

  // gov
  voteProposal(
    voter: string,
    proposalId: number,
    option: VoteOption,
  ): Promise<DeliverTxResponse>

  // distribution
  withdrawDelegatorReward(
    delegatorAddress: string,
    validatorAddress: string,
  ): Promise<DeliverTxResponse>

  withdrawValidatorCommission(
    validatorAddress: string,
  ): Promise<DeliverTxResponse>

  //staking
  delegate(
    delegatorAddress: string,
    validatorAddress: string,
    amount: Coin | undefined,
  ): Promise<DeliverTxResponse>

  undelegate(
    delegatorAddress: string,
    validatorAddress: string,
    amount: Coin | undefined,
  ): Promise<DeliverTxResponse>
}

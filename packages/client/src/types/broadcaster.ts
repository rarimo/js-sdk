import type { DeliverTxResponse } from '@cosmjs/stargate'

import { Coin } from '@/codec/cosmos/base/v1beta1/coin'
import { ProposalType, VoteOption } from '@/enums'

import type { MsgSubmitProposal } from './gov'

export type RarimoBroadcaster = {
  disconnect: () => void

  // gov
  submitProposal(
    proposalType: ProposalType,
    msg: MsgSubmitProposal,
  ): Promise<DeliverTxResponse>

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

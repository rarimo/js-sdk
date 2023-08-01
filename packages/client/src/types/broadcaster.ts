import type { DeliverTxResponse } from '@cosmjs/stargate'

import { Coin } from '@/codec/cosmos/base/v1beta1/coin'
import { VoteOption } from '@/enums'

export type RarimoBroadcaster = {
  disconnect: () => void

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

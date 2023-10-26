import { MsgExec } from '@/codec/cosmos/authz/v1beta1/tx'
import { Coin } from '@/codec/cosmos/base/v1beta1/coin'
import {
  MsgWithdrawDelegatorReward,
  MsgWithdrawValidatorCommission,
} from '@/codec/cosmos/distribution/v1beta1/tx'
import { VoteOption as EVoteOption } from '@/codec/cosmos/gov/v1beta1/gov'
import { MsgVote } from '@/codec/cosmos/gov/v1beta1/tx'
import { MsgDelegate, MsgUndelegate } from '@/codec/cosmos/staking/tx'
import { Any } from '@/codec/google/protobuf/any'
import { VoteOption } from '@/enums'
import { makeBroadcastMaker } from '@/helpers'
import type { Config, RarimoBroadcaster, Wallet } from '@/types'

export const makeRarimoBroadcaster = async (
  config: Config,
  wallet: Wallet,
): Promise<RarimoBroadcaster> => {
  const api = await makeBroadcastMaker(config, wallet)
  const broadcaster = api.makeBroadcastCaller

  const exec = (grantee: string, msgs: Any[]) => {
    return broadcaster<MsgExec>(
      '/cosmos.authz.v1beta1.MsgExec',
      MsgExec,
    )(
      MsgExec.fromPartial({
        grantee,
        msgs,
      }),
    )
  }

  return {
    disconnect: api.disconnect,

    // authz
    exec,

    execDelegate: (
      grantee: string,
      delegatorAddress: string,
      validatorAddress: string,
      amount?: Coin,
    ) => {
      const delegateMsg = MsgDelegate.fromPartial({
        delegatorAddress,
        validatorAddress,
        amount,
      })

      return exec(grantee, [
        Any.fromPartial({
          typeUrl: '/cosmos.staking.v1beta1.MsgDelegate',
          value: MsgDelegate.encode(delegateMsg).finish(),
        }),
      ])
    },

    // gov
    voteProposal: (voter: string, proposalId: number, option: VoteOption) => {
      return broadcaster<MsgVote>(
        '/cosmos.gov.v1beta1.MsgVote',
        MsgVote,
      )(
        MsgVote.fromPartial({
          voter,
          option: option as unknown as EVoteOption,
          proposalId,
        }),
      )
    },

    // distribution
    withdrawDelegatorReward: (
      delegatorAddress: string,
      validatorAddress: string,
    ) => {
      return broadcaster<MsgWithdrawDelegatorReward>(
        '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward',
        MsgWithdrawDelegatorReward,
      )(
        MsgWithdrawDelegatorReward.fromPartial({
          delegatorAddress,
          validatorAddress,
        }),
      )
    },

    withdrawValidatorCommission: (validatorAddress: string) => {
      return broadcaster<MsgWithdrawValidatorCommission>(
        '/cosmos.distribution.v1beta1.MsgWithdrawValidatorCommission',
        MsgWithdrawValidatorCommission,
      )(MsgWithdrawValidatorCommission.fromPartial({ validatorAddress }))
    },

    // staking
    delegate: (
      delegatorAddress: string,
      validatorAddress: string,
      amount?: Coin,
    ) => {
      return broadcaster<MsgDelegate>(
        '/cosmos.staking.v1beta1.MsgDelegate',
        MsgDelegate,
      )(MsgDelegate.fromPartial({ delegatorAddress, validatorAddress, amount }))
    },

    undelegate: (
      delegatorAddress: string,
      validatorAddress: string,
      amount: Coin | undefined,
    ) => {
      return broadcaster<MsgUndelegate>(
        '/cosmos.staking.v1beta1.MsgUndelegate',
        MsgUndelegate,
      )(
        MsgUndelegate.fromPartial({
          delegatorAddress,
          validatorAddress,
          amount,
        }),
      )
    },
  }
}

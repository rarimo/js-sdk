import type { GeneratedType } from '@cosmjs/proto-signing'

import { MsgExec } from '@/codec/cosmos/authz/v1beta1/tx'
import { MsgSend } from '@/codec/cosmos/bank/v1beta1/tx'
import { Coin } from '@/codec/cosmos/base/v1beta1/coin'
import {
  MsgWithdrawDelegatorReward,
  MsgWithdrawValidatorCommission,
} from '@/codec/cosmos/distribution/v1beta1/tx'
import {
  TextProposal,
  VoteOption as EVoteOption,
} from '@/codec/cosmos/gov/v1beta1/gov'
import { MsgSubmitProposal, MsgVote } from '@/codec/cosmos/gov/v1beta1/tx'
import { MsgDelegate, MsgUndelegate } from '@/codec/cosmos/staking/tx'
import { Any } from '@/codec/google/protobuf/any'
import { MessageTypeUrls, VoteOption } from '@/enums'
import { makeBroadcastMaker } from '@/helpers'
import type { Config, RarimoBroadcaster, Wallet } from '@/types'

export const makeRarimoBroadcaster = async (
  config: Config,
  wallet: Wallet,
): Promise<RarimoBroadcaster> => {
  const api = await makeBroadcastMaker(config, wallet)
  const broadcaster = api.makeBroadcastCaller
  const registy = api.stargateRegistry

  const exec = (grantee: string, msgs: Any[]) => {
    return broadcaster<MsgExec>(
      MessageTypeUrls.Exec,
      MsgExec,
    )(
      MsgExec.fromPartial({
        grantee,
        msgs,
      }),
    )
  }

  const encodeAsAny = (
    typeUrl: string,
    type: GeneratedType,
    value: unknown,
  ) => {
    registy.register(typeUrl, type)
    return registy.encodeAsAny({ typeUrl, value })
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
        encodeAsAny(MessageTypeUrls.Delegate, MsgDelegate, delegateMsg),
      ])
    },

    execUndelegate: (
      grantee: string,
      delegatorAddress: string,
      validatorAddress: string,
      amount?: Coin,
    ) => {
      const undelegateMsg = MsgUndelegate.fromPartial({
        delegatorAddress,
        validatorAddress,
        amount,
      })

      return exec(grantee, [
        encodeAsAny(MessageTypeUrls.Undelegate, MsgUndelegate, undelegateMsg),
      ])
    },

    execVoteProposal: (
      grantee: string,
      voter: string,
      proposalId: number,
      option: VoteOption,
    ) => {
      const voteMsg = MsgVote.fromPartial({
        voter,
        option: option as unknown as EVoteOption,
        proposalId,
      })

      return exec(grantee, [
        encodeAsAny(MessageTypeUrls.Vote, MsgVote, voteMsg),
      ])
    },

    execWithdrawDelegatorReward: (
      grantee: string,
      delegatorAddress: string,
      validatorAddress: string,
    ) => {
      const mgs = MsgWithdrawDelegatorReward.fromPartial({
        delegatorAddress,
        validatorAddress,
      })

      return exec(grantee, [
        encodeAsAny(
          MessageTypeUrls.WithdrawDelegatorReward,
          MsgWithdrawDelegatorReward,
          mgs,
        ),
      ])
    },

    // bank
    send: (fromAddress: string, toAddress: string, amount: Coin[]) => {
      return broadcaster<MsgSend>(
        MessageTypeUrls.Send,
        MsgSend,
      )(MsgSend.fromPartial({ fromAddress, toAddress, amount }))
    },

    // gov
    submitTextProposal: (
      proposer: string,
      initialDeposit: Coin[],
      title: string,
      description: string,
    ) => {
      return broadcaster<MsgSubmitProposal>(
        MessageTypeUrls.SubmitProposal,
        MsgSubmitProposal,
      )(
        MsgSubmitProposal.fromPartial({
          proposer,
          initialDeposit,
          content: encodeAsAny(
            MessageTypeUrls.TextProposal,
            TextProposal,
            TextProposal.fromPartial({
              title,
              description,
            }),
          ),
        }),
      )
    },

    voteProposal: (voter: string, proposalId: number, option: VoteOption) => {
      return broadcaster<MsgVote>(
        MessageTypeUrls.Vote,
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
        MessageTypeUrls.WithdrawDelegatorReward,
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
        MessageTypeUrls.WithdrawValidatorCommission,
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
        MessageTypeUrls.Delegate,
        MsgDelegate,
      )(MsgDelegate.fromPartial({ delegatorAddress, validatorAddress, amount }))
    },

    undelegate: (
      delegatorAddress: string,
      validatorAddress: string,
      amount?: Coin,
    ) => {
      return broadcaster<MsgUndelegate>(
        MessageTypeUrls.Undelegate,
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

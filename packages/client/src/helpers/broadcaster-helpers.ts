import type { TsProtoGeneratedType } from '@cosmjs/proto-signing/build/registry'

import { MsgSubmitProposal } from '@/codec/cosmos/gov/v1beta1/tx'
import { Any } from '@/codec/google/protobuf/any'
import {
  DropPartiesProposal,
  ReshareKeysProposal,
  SlashProposal,
  UnfreezeSignerPartyProposal,
} from '@/codec/rarimocore/rarimocore/proposal'
import {
  AddCollectionDataProposal,
  AddFeeTokenProposal,
  AddNetworkProposal,
  CreateCollectionProposal,
  RemoveCollectionDataProposal,
  RemoveCollectionProposal,
  RemoveFeeTokenProposal,
  RemoveNetworkProposal,
  RemoveTokenItemProposal,
  UpdateCollectionDataProposal,
  UpdateFeeTokenProposal,
  UpdateTokenItemProposal,
  UpgradeContractProposal,
  WithdrawFeeProposal,
} from '@/codec/rarimocore/tokenmanager/proposal'
import { PACKAGES } from '@/const'
import { ProposalType } from '@/enums'
import type {
  MsgSubmitProposal as TMsgSubmitProposal,
  SubmitProposalContent,
} from '@/types'

const PROPOSAL_CONTENT_MAP: { [key in ProposalType]?: TsProtoGeneratedType } = {
  [ProposalType.UnfreezeSignerParty]: UnfreezeSignerPartyProposal,
  [ProposalType.Slash]: SlashProposal,
  [ProposalType.ReshareKeys]: ReshareKeysProposal,
  [ProposalType.DropParties]: DropPartiesProposal,
  [ProposalType.UpgradeContract]: UpgradeContractProposal,
  [ProposalType.AddNetwork]: AddNetworkProposal,
  [ProposalType.RemoveNetwork]: RemoveNetworkProposal,
  [ProposalType.AddFeeToken]: AddFeeTokenProposal,
  [ProposalType.UpdateFeeToken]: UpdateFeeTokenProposal,
  [ProposalType.RemoveFeeToken]: RemoveFeeTokenProposal,
  [ProposalType.WithdrawFee]: WithdrawFeeProposal,
  [ProposalType.CreateCollection]: CreateCollectionProposal,
  [ProposalType.RemoveCollection]: RemoveCollectionProposal,
  [ProposalType.AddCollectionData]: AddCollectionDataProposal,
  [ProposalType.UpdateCollectionData]: UpdateCollectionDataProposal,
  [ProposalType.RemoveCollectionData]: RemoveCollectionDataProposal,
  [ProposalType.UpdateTokenItem]: UpdateTokenItemProposal,
  [ProposalType.RemoveTokenItem]: RemoveTokenItemProposal,
}

export const createMsgSubmitProposal = (
  proposalType: ProposalType,
  msg: TMsgSubmitProposal,
) => {
  return MsgSubmitProposal.fromPartial({
    content: getContent(proposalType, msg.content),
    initialDeposit: msg.initialDeposit,
    proposer: msg.proposer,
  })
}

export const getContent = (
  proposalType: ProposalType,
  content: SubmitProposalContent,
) => {
  return Any.fromPartial({
    typeUrl: `/${getProtobufPackageName(proposalType)}.${proposalType}`,
    value: PROPOSAL_CONTENT_MAP[proposalType]!.encode(content).finish(),
  })
}

const getProtobufPackageName = (type: ProposalType) => {
  switch (type) {
    case ProposalType.UnfreezeSignerParty:
    case ProposalType.Slash:
    case ProposalType.ReshareKeys:
    case ProposalType.DropParties:
      return PACKAGES.rarimocore
    case ProposalType.UpgradeContract:
    case ProposalType.AddNetwork:
    case ProposalType.RemoveNetwork:
    case ProposalType.AddFeeToken:
    case ProposalType.UpdateFeeToken:
    case ProposalType.RemoveFeeToken:
    case ProposalType.WithdrawFee:
    case ProposalType.CreateCollection:
    case ProposalType.RemoveCollection:
    case ProposalType.AddCollectionData:
    case ProposalType.UpdateCollectionData:
    case ProposalType.RemoveCollectionData:
    case ProposalType.UpdateTokenItem:
    case ProposalType.RemoveTokenItem:
      return PACKAGES.tokenmanager
    default:
      throw new Error('Unknown proposal type')
  }
}

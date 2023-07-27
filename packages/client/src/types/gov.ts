import type { ProposalStatus } from '@/enums'
import type {
  DropPartiesProposal,
  ReshareKeysProposal,
  SlashProposal,
  UnfreezeSignerPartyProposal,
} from '@/types/rarimocore'
import type {
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
} from '@/types/tokenmanager'

import type { Coin } from './bank'
import type { BaseModel } from './base'

export type VotingParams = {
  voting_period: string
}

export type DepositParams = {
  min_deposit: Coin[]
  max_deposit_period: string
}

export type TallyParams = {
  quorum: string
  threshold: string
  veto_threshold: string
}

export type GovParams = {
  voting_params: VotingParams | null
  deposit_params: DepositParams | null
  tally_params: TallyParams | null
}

export type FinalTallyResult = {
  yes_count: string
  abstain_count: string
  no_count: string
  no_with_veto_count: string
}

export type Proposal = {
  id: string
  messages: BaseModel<string>[]
  status: ProposalStatus
  final_tally_result?: FinalTallyResult
  submit_block: string
  deposit_end_block: string
  total_deposit: Coin[]
  voting_start_block: string
  voting_end_block: string
  metadata: string
}

export type SubmitProposalContent =
  | UpgradeContractProposal
  | AddNetworkProposal
  | RemoveNetworkProposal
  | AddFeeTokenProposal
  | UpdateFeeTokenProposal
  | RemoveFeeTokenProposal
  | WithdrawFeeProposal
  | UpdateTokenItemProposal
  | RemoveTokenItemProposal
  | CreateCollectionProposal
  | UpdateCollectionDataProposal
  | AddCollectionDataProposal
  | RemoveCollectionDataProposal
  | RemoveCollectionProposal
  | UnfreezeSignerPartyProposal
  | ReshareKeysProposal
  | SlashProposal
  | DropPartiesProposal

/**
 * MsgSubmitProposal defines an sdk.Msg type that supports submitting arbitrary
 * proposal Content.
 */
export type MsgSubmitProposal = {
  content: SubmitProposalContent
  initialDeposit: Coin[]
  proposer: string
}

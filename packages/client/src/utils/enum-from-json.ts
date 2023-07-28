import {
  proposalStatusFromJSON as _proposalStatusFromJSON,
  voteOptionFromJSON as _voteOptionFromJSON,
} from '@/codec/cosmos/gov/v1beta1/gov'
import { ProposalStatus, VoteOption } from '@/enums'

export const proposalStatusFromJSON = (status: string): ProposalStatus => {
  return _proposalStatusFromJSON(status) as unknown as ProposalStatus
}

export const voteOptionFromJSON = (option: string): VoteOption => {
  return _voteOptionFromJSON(option) as unknown as VoteOption
}

import {
  proposalStatusFromJSON as _proposalStatusFromJSON,
  voteOptionFromJSON as _voteOptionFromJSON,
} from '@/codec/cosmos/gov/v1beta1/gov'
import { OracleStatus, PartyStatus, ProposalStatus, VoteOption } from '@/enums'

export const proposalStatusFromJSON = (
  status: string | number,
): ProposalStatus => {
  return _proposalStatusFromJSON(status) as unknown as ProposalStatus
}

export const voteOptionFromJSON = (option: string | number): VoteOption => {
  return _voteOptionFromJSON(option) as unknown as VoteOption
}

export function partyStatusFromJSON(object: string | number): PartyStatus {
  switch (object) {
    case 0:
    case 'Active':
      return PartyStatus.Active
    case 1:
    case 'Frozen':
      return PartyStatus.Frozen
    case 2:
    case 'Slashed':
      return PartyStatus.Slashed
    case 3:
    case 'Inactive':
      return PartyStatus.Inactive
    case -1:
    case 'UNRECOGNIZED':
    default:
      return PartyStatus.Unrecognized
  }
}

export function oracleStatusFromJSON(object: string | number): OracleStatus {
  switch (object) {
    case 0:
    case 'Inactive':
      return OracleStatus.Inactive
    case 1:
    case 'Active':
      return OracleStatus.Active
    case 2:
    case 'Jailed':
      return OracleStatus.Jailed
    case 3:
    case 'Freezed':
      return OracleStatus.Freezed
    case 4:
    case 'Slashed':
      return OracleStatus.Slashed
    case -1:
    case 'UNRECOGNIZED':
    default:
      return OracleStatus.Unrecognized
  }
}

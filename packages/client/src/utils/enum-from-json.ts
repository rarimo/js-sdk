import {
  proposalStatusFromJSON as _proposalStatusFromJSON,
  voteOptionFromJSON as _voteOptionFromJSON,
} from '@/codec/cosmos/gov/v1beta1/gov'
import {
  NetworkParamType,
  NetworkType,
  OpStatus,
  OpType,
  OpVoteType,
  OracleStatus,
  PartyStatus,
  ProposalStatus,
  TokenType,
  VoteOption,
} from '@/enums'

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

export function opTypeFromJSON(object: string | number): OpType {
  switch (object) {
    case 0:
    case 'TRANSFER':
      return OpType.Transfer
    case 1:
    case 'CHANGE_PARTIES':
      return OpType.ChangeParties
    case 2:
    case 'FEE_TOKEN_MANAGEMENT':
      return OpType.FeeTokenManagement
    case 3:
    case 'CONTRACT_UPGRADE':
      return OpType.ContractUpgrade
    case 4:
    case 'IDENTITY_DEFAULT_TRANSFER':
      return OpType.IdentityDefaultTransfer
    case 5:
    case 'IDENTITY_AGGREGATED_TRANSFER':
      return OpType.IdentityAggregatedTransfer
    case 6:
    case 'IDENTITY_GIST_TRANSFER':
      return OpType.IdentityGistTransfer
    case 7:
    case 'IDENTITY_STATE_TRANSFER':
      return OpType.IdentityStateTransfer
    case -1:
    case 'UNRECOGNIZED':
    default:
      return OpType.Unrecognized
  }
}

export function opStatusFromJSON(object: string | number): OpStatus {
  switch (object) {
    case 0:
    case 'INITIALIZED':
      return OpStatus.Initialized
    case 1:
    case 'APPROVED':
      return OpStatus.Approved
    case 2:
    case 'NOT_APPROVED':
      return OpStatus.NotApproved
    case 3:
    case 'SIGNED':
      return OpStatus.Signed
    case -1:
    case 'UNRECOGNIZED':
    default:
      return OpStatus.Unrecognized
  }
}

export function opVoteTypeFromJSON(object: string | number): OpVoteType {
  switch (object) {
    case 0:
    case 'YES':
      return OpVoteType.Yes
    case 1:
    case 'NO':
      return OpVoteType.No
    case -1:
    case 'UNRECOGNIZED':
    default:
      return OpVoteType.Unrecognized
  }
}

export function networkTypeFromJSON(object: string | number): NetworkType {
  switch (object) {
    case 0:
    case 'EVM':
      return NetworkType.EVM
    case 1:
    case 'Solana':
      return NetworkType.Solana
    case 2:
    case 'Near':
      return NetworkType.Near
    case 3:
    case 'Other':
      return NetworkType.Other
    case 4:
    case 'Rarimo':
      return NetworkType.Rarimo
    case -1:
    case 'UNRECOGNIZED':
    default:
      return NetworkType.Unrecognized
  }
}

export function networkParamTypeFromJSON(
  object: string | number,
): NetworkParamType {
  switch (object) {
    case 0:
    case 'BRIDGE':
      return NetworkParamType.Bridge
    case 1:
    case 'FEE':
      return NetworkParamType.Fee
    case 2:
    case 'IDENTITY':
      return NetworkParamType.Identity
    case -1:
    case 'UNRECOGNIZED':
    default:
      return NetworkParamType.Unrecognized
  }
}

export function typeFromJSON(object: string | number): TokenType {
  switch (object) {
    case 0:
    case 'NATIVE':
      return TokenType.Native
    case 1:
    case 'ERC20':
      return TokenType.Erc20
    case 2:
    case 'ERC721':
      return TokenType.Erc721
    case 3:
    case 'ERC1155':
      return TokenType.Erc1155
    case 4:
    case 'METAPLEX_NFT':
      return TokenType.MetaplexNft
    case 5:
    case 'METAPLEX_FT':
      return TokenType.MetaplexFt
    case 6:
    case 'NEAR_FT':
      return TokenType.NearFt
    case 7:
    case 'NEAR_NFT':
      return TokenType.NearNft
    case -1:
    case 'UNRECOGNIZED':
    default:
      return TokenType.Unrecognized
  }
}

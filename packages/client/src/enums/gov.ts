// ProposalStatus enumerates the valid statuses of a proposal.
export enum ProposalStatus {
  // Defines the default proposal status.
  Unspecified = 0,
  // Defines a proposal status during the deposit period.
  DepositPeriod = 1,
  // Defines a proposal status during the voting period.
  VotingPeriod = 2,
  // Defines a proposal status of a proposal that has passed.
  Passed = 3,
  //Defines a proposal status of a proposal that has been rejected.
  Rejected = 4,
  //Defines a proposal status of a proposal that has failed.
  Failed = 5,
  Unrecognized = -1,
}

// VoteOption enumerates the valid vote options for a given governance proposal.
export enum VoteOption {
  // Defines a no-op vote option.
  Unspecified = 0,
  // Defines a yes vote option.
  Yes = 1,
  // Defines an abstain vote option.
  Abstain = 2,
  // Defines a no vote option.
  No = 3,
  // Defines a no with veto vote option.
  NoWithVeto = 4,
  Unrecognized = -1,
}

export enum ProposalType {
  // rarimocore
  UnfreezeSignerParty = 'UnfreezeSignerPartyProposal',
  ReshareKeys = 'ReshareKeysProposal',
  Slash = 'SlashProposal',
  DropParties = 'DropPartiesProposal',

  // tokenmanager
  UpgradeContract = 'UpgradeContractProposal',
  AddNetwork = 'AddNetworkProposal',
  RemoveNetwork = 'RemoveNetworkProposal',
  AddFeeToken = 'AddFeeTokenProposal',
  UpdateFeeToken = 'UpdateFeeTokenProposal',
  RemoveFeeToken = 'RemoveFeeTokenProposal',
  WithdrawFee = 'WithdrawFeeProposal',
  CreateCollection = 'CreateCollectionProposal',
  RemoveCollection = 'RemoveCollectionProposal',
  AddCollectionData = 'AddCollectionDataProposal',
  UpdateCollectionData = 'UpdateCollectionDataProposal',
  RemoveCollectionData = 'RemoveCollectionDataProposal',
  UpdateTokenItem = 'UpdateTokenItemProposal',
  RemoveTokenItem = 'RemoveTokenItemProposal',

  // oracle
  OracleUnfreeze = 'OracleUnfreezeProposal',
  OracleChangeParams = 'OracleChangeParamsProposal',

  // bridge
  BridgeChangeParams = 'BridgeChangeParamsProposal',

  // Cosmos default proposals
  // upgrade
  SoftwareUpgrade = 'SoftwareUpgradeProposal',
  CancelSoftwareUpgrade = 'CancelSoftwareUpgradeProposal',
  // params
  ParameterChange = 'ParameterChangeProposal',
  // distribution
  CommunityPoolSpend = 'CommunityPoolSpendProposal',
  // bank
  MintTokens = 'MintTokensProposal',
}

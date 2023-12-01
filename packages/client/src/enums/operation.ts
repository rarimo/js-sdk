export enum OperationStatus {
  Signed = 'SIGNED',
  Initialized = 'INITIALIZED',
  Approved = 'APPROVED',
  NotApproved = 'NOT_APPROVED',
}

export enum OpStatus {
  Initialized = 0,
  Approved = 1,
  NotApproved = 2,
  Signed = 3,
  Unrecognized = -1,
}

export enum OpType {
  Transfer = 0,
  ChangeParties = 1,
  FeeTokenManagement = 2,
  ContractUpgrade = 3,
  IdentityDefaultTransfer = 4,
  IdentityAggregatedTransfer = 5,
  IdentityGistTransfer = 6,
  IdentityStateTransfer = 7,
  Unrecognized = -1,
}

export enum OpVoteType {
  Yes = 0,
  No = 1,
  Unrecognized = -1,
}

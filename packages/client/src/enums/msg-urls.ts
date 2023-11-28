export enum MessageTypeUrls {
  Grant = '/cosmos.authz.v1beta1.MsgGrant',
  Revoke = '/cosmos.authz.v1beta1.MsgRevoke',
  Exec = '/cosmos.authz.v1beta1.MsgExec',

  Send = '/cosmos.bank.v1beta1.MsgSend',
  MultiSend = '/cosmos.bank.v1beta1.MsgMultiSend',

  VerifyInvariant = '/cosmos.crisis.v1beta1.MsgVerifyInvariant',

  FundCommunityPool = '/cosmos.distribution.v1beta1.MsgFundCommunityPool',
  WithdrawDelegatorReward = '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward',
  WithdrawValidatorCommission = '/cosmos.distribution.v1beta1.MsgWithdrawValidatorCommission',
  SetWithdrawAddress = '/cosmos.distribution.v1beta1.MsgSetWithdrawAddress',

  SubmitEvidence = '/cosmos.evidence.v1beta1.MsgSubmitEvidence',

  RevokeAllowance = '/cosmos.feegrant.v1beta1.MsgRevokeAllowance',
  GrantAllowance = '/cosmos.feegrant.v1beta1.MsgGrantAllowance',

  Vote = '/cosmos.gov.v1beta1.MsgVote',
  Deposit = '/cosmos.gov.v1beta1.MsgDeposit',
  VoteWeighted = '/cosmos.gov.v1beta1.MsgVoteWeighted',
  SubmitProposal = '/cosmos.gov.v1beta1.MsgSubmitProposal',

  Unjail = '/cosmos.slashing.v1beta1.MsgUnjail',

  BeginRedelegate = '/cosmos.staking.v1beta1.MsgBeginRedelegate',
  CreateValidator = '/cosmos.staking.v1beta1.MsgCreateValidator',
  EditValidator = '/cosmos.staking.v1beta1.MsgEditValidator',
  Delegate = '/cosmos.staking.v1beta1.MsgDelegate',
  Undelegate = '/cosmos.staking.v1beta1.MsgUndelegate',

  CreateVestingAccount = '/cosmos.vesting.v1beta1.MsgCreateVestingAccount',

  Transfer = '/ibc.applications.transfer.v1.MsgTransfer',

  CreateChangePartiesOp = '/rarimo.rarimocore.rarimocore.MsgCreateChangePartiesOp',
  SetupInitial = '/rarimo.rarimocore.rarimocore.MsgSetupInitial',
  RarimoCreateTransferOp = '/rarimo.rarimocore.rarimocore.MsgCreateTransferOp',
  CreateConfirmation = '/rarimo.rarimocore.rarimocore.MsgCreateConfirmation',
  RarimoVote = '/rarimo.rarimocore.rarimocore.MsgVote',
  CreateViolationReport = '/rarimo.rarimocore.rarimocore.MsgCreateViolationReport',
  RarimoStake = '/rarimo.rarimocore.rarimocore.MsgStake',
  RarimoUnstake = '/rarimo.rarimocore.rarimocore.MsgUnstake',
  ChangePartyAddress = '/rarimo.rarimocore.rarimocore.MsgChangePartyAddress',

  EthereumTx = '/ethermint.evm.v1.MsgEthereumTx',

  DeleteInfo = '/rarimo.rarimocore.tokenmanager.MsgDeleteInfo',
  CreateInfo = '/rarimo.rarimocore.tokenmanager.MsgCreateInfo',
  AddChain = '/rarimo.rarimocore.tokenmanager.MsgAddChain',

  DepositNative = '/rarimo.rarimocore.bridge.MsgDepositNative',
  WithdrawNative = '/rarimo.rarimocore.bridge.MsgWithdrawNative',

  MultisigSubmitProposal = '/rarimo.rarimocore.multisig.MsgSubmitProposal',
  MultisigVote = '/rarimo.rarimocore.multisig.MsgVote',
  CreateGroup = '/rarimo.rarimocore.multisig.MsgCreateGroup',
  ChangeGroup = '/rarimo.rarimocore.multisig.MsgChangeGroup',

  OracleStake = '/rarimo.rarimocore.oraclemanager.MsgStake',
  OracleUnstake = '/rarimo.rarimocore.oraclemanager.MsgUnstake',
  OracleCreateTransferOp = '/rarimo.rarimocore.oraclemanager.MsgCreateTransferOp',
  OracleVote = '/rarimo.rarimocore.oraclemanager.MsgVote',
  OracleUnjail = '/rarimo.rarimocore.oraclemanager.MsgUnjail',
  CreateIdentityDefaultTransferOp = '/rarimo.rarimocore.oraclemanager.MsgCreateIdentityDefaultTransferOp',
  CreateIdentityGISTTransferOp = '/rarimo.rarimocore.oraclemanager.MsgCreateIdentityGISTTransferOp',
  CreateIdentityStateTransferOp = '/rarimo.rarimocore.oraclemanager.MsgCreateIdentityStateTransferOp',
}

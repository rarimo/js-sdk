export enum DelegateTypes {
  Delegate = 'delegate',
  Undelegate = 'undelegate',
}

// BondStatus is the status of a validator.
export enum BondStatus {
  // Defines an invalid validator status.
  Unspecified = 0,
  // Defines a validator that is not bonded.
  Unbonded = 1,
  // Defines a validator that is unbonding.
  Unbonding = 2,
  // Defines a validator that is bonded.
  Bonded = 3,
  Unrecognized = -1,
}

export enum StakingAuthorizationTypes {
  // Specifies an unknown authorization type
  Unspecified = 0,
  // Defines an authorization type for Msg/Delegate
  Delegate = 1,
  // Defines an authorization type for Msg/Undelegate
  Undelegate = 2,
  // Defines an authorization type for Msg/BeginRedelegate
  Redelegate = 3,
  Unrecognized = -1,
}

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
  /// Bonded - BONDED defines a validator that is bonded.
  Bonded = 3,
  Unrecognized = -1,
}

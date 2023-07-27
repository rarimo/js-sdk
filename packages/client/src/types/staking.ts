import type { Coin } from './bank'

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
  UNRECOGNIZED = -1,
}

export type Delegation = {
  delegator_address: string
  validator_address: string
  shares: string
}

export type DelegationResponse = {
  delegation_response: {
    delegation: Delegation
    balance: Coin
  }
}

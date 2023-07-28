import type { Coin } from './bank'

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

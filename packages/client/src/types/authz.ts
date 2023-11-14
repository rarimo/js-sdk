import { AuthorizationTypes, StakingAuthorizationTypes } from '@/enums'

import type { Coin } from './bank'
import type { BaseModel } from './base'

export type GenericAuthorization =
  BaseModel<AuthorizationTypes.GenericAuthorization> & {
    msg: string
  }

export type SendAuthorization =
  BaseModel<AuthorizationTypes.SendAuthorization> & {
    spend_limit: Coin[]
  }

export type StakeAuthorizationValidators = {
  address: string[]
}

export type StakeAuthorization =
  BaseModel<AuthorizationTypes.StakeAuthorization> & {
    max_tokens?: Coin
    allow_list?: StakeAuthorizationValidators
    deny_list?: StakeAuthorizationValidators
    authorization_type: StakingAuthorizationTypes
  }

export type GrantAuthorization = {
  granter: string
  grantee: string
  authorization?: GenericAuthorization | SendAuthorization | StakeAuthorization
  expiration?: string
}

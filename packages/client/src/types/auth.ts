import { AccountType, PublicKeyType } from '@/enums'

import type { BaseModel } from './base'

export type PublicKey = BaseModel<PublicKeyType> & {
  key: string
}

export type Account = BaseModel<AccountType> & {
  base_account: {
    address: string
    pub_key: PublicKey | null
    account_number: string
    sequence: string
  }
  name: string
  permissions?: string[]
  code_hash?: string
}

import type { Hash, Siblings } from '@iden3/js-merkletree'
import type { VerifiableCredentials } from '@rarimo/auth-zkp-iden3'
import { Identity } from '@rarimo/identity-gen-iden3'

import { ZKP_OPERATORS } from '@/enums'

export type ZkpGenQuery = {
  variableName: string
  operator: ZKP_OPERATORS
  value: string
}

export type ZkpGenCreateOpts<T extends { [key: string]: number }> = {
  requestId: string
  identity: Identity
  verifiableCredentials: VerifiableCredentials<T>

  challenge: string

  query: ZkpGenQuery
}

export type IssuerState = {
  claimsTreeRoot: Hash
  revocationTreeRoot: Hash
  rootOfRoots: Hash
  state: Hash
}

export type ClaimStatus = {
  issuer: IssuerState
  mtp: {
    existence: boolean
    siblings: Siblings
  }
}

export type Schema = {
  $metadata: {
    uris: {
      jsonLdContext: string
      jsonSchema: string
    }
  }
}

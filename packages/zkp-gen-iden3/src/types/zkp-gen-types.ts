import type { Hash, Siblings } from '@iden3/js-merkletree'
import type { VerifiableCredentials } from '@rarimo/auth-zkp-iden3'
import type { Identity } from '@rarimo/identity-gen-iden3'
import type { RawProvider } from '@rarimo/provider'

import type { ZkpOperators } from '@/enums'

export type QueryVariableNameAbstract = { [key: string]: number }

export type ZkpGenQuery<T extends QueryVariableNameAbstract> = {
  variableName: keyof T
  operator: ZkpOperators
  value: string[]
}

export type ZkpGenCreateOpts<T extends QueryVariableNameAbstract> = {
  requestId: string
  identity: Identity
  verifiableCredentials: VerifiableCredentials<T>

  challenge: string

  query: ZkpGenQuery<T>
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
    nodeAux?: {
      key: Hash
      value: Hash
    }
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

export type Config = {
  RPC_URL?: string
  RAW_PROVIDER?: RawProvider
  ISSUER_API_URL: string
  STATE_V2_ADDRESS: string
  CIRCUIT_WASM_URL: string
  CIRCUIT_FINAL_KEY_URL: string
  CLAIM_PROOF_SIBLINGS_COUNT: number
}

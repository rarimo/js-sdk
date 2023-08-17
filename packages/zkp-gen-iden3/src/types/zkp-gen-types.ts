import type { FetcherStandaloneConfig } from '@distributedlab/fetcher'
import type { VerifiableCredentials } from '@rarimo/auth-zkp-iden3'
import type { Identity } from '@rarimo/identity-gen-iden3'
import type { RawProvider } from '@rarimo/provider'

import type { ZkpOperators } from '@/enums'
import { CircuitId } from '@/enums'

export type QueryVariableNameAbstract = { [key: string]: number }

export type ZkpGenQuery<T extends QueryVariableNameAbstract> = {
  circuitId: CircuitId
  variableName: keyof T
  operator: ZkpOperators
  value: string[]
  issuerId: string
}

export type ZkpGenCreateOpts<T extends QueryVariableNameAbstract> = {
  requestId: string
  identity: Identity
  verifiableCredentials: VerifiableCredentials<T>

  challenge: string

  query: ZkpGenQuery<T>
}

export type ClaimStatusMtp = {
  existence: boolean
  depth: number
  notEmpties: Uint8Array
  siblings: string[]
  nodeAux?: {
    key: string
    value: string
  }
}

export type ClaimStatus = {
  issuer: {
    claimsTreeRoot: string
    revocationTreeRoot: string
    rootOfRoots: string
    state: string
  }
  mtp: ClaimStatusMtp
}

export type ClaimNonRevStatus = ClaimStatus

export type ClaimIncStatus = ClaimStatus

export type Schema = {
  $metadata: {
    uris: {
      jsonLdContext: string
      jsonSchema: string
    }
  }
}

export type Config = {
  TARGET_CHAIN_RPC_URL: string
  CORE_CHAIN_RPC_URL: string

  RAW_PROVIDER?: RawProvider
  ISSUER_API_URL: string

  STATE_V2_ADDRESS: string
  LIGHTWEIGHT_STATE_V2_ADDRESS: string

  CIRCUIT_SIG_V2_ON_CHAIN_WASM_URL: string
  CIRCUIT_SIG_V2_ON_CHAIN_FINAL_KEY_URL: string
  CIRCUIT_SIG_V2_WASM_URL: string
  CIRCUIT_SIG_V2_FINAL_KEY_URL: string
  CIRCUIT_MTP_V2_WASM_URL: string
  CIRCUIT_MTP_V2_FINAL_KEY_URL: string
  CIRCUIT_MTP_V2_ON_CHAIN_WASM_URL: string
  CIRCUIT_MTP_V2_ON_CHAIN_FINAL_KEY_URL: string
  CLAIM_PROOF_SIBLINGS_COUNT: number

  CIRCUIT_LOADING_OPTS?: FetcherStandaloneConfig
}

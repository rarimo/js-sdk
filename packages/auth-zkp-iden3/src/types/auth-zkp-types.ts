import type { FetcherStandaloneConfig } from '@distributedlab/fetcher'
import type { Proof } from '@iden3/js-merkletree'
import type { RawProvider } from '@rarimo/provider'

export type IssuerData = {
  authCoreClaim: string
  credentialStatus: {
    id: string
    revocationNonce: number
    type: string
  }
  id: string
  mtp: {
    existence: boolean
    siblings: string[]
  }
  state: {
    blockNumber: number
    blockTimestamp: number
    claimsTreeRoot: string
    revocationTreeRoot: string
    rootOfRoots: string
    txId: string
    value: string
  }
  signature: string
  type: string
}

export type QueryVariableNameAbstract = { [key: string]: number }

export interface VerifiableCredentials<T extends QueryVariableNameAbstract> {
  body: {
    credential: {
      ['@context']: string[]
      credentialSchema: {
        id: string
        type: string
      }
      credentialStatus: {
        id: string
        revocationNonce: number
        type: string
      }
      credentialSubject: {
        id: string
        type: string
      } & T
      expirationDate: string
      id: string
      issuanceDate: string
      issuer: string
      proof?: [
        /**
         * Used to generate sig proofs
         */
        {
          coreClaim: string
          issuerData: IssuerData
          signature: string
          type: string
          issuerProofUpdateUrl: string
        },
        /**
         * Used to generate MTP proofs
         */
        {
          id: string
          coreClaim: string
          issuerData: IssuerData
          mtp: Proof
          type: string
        },
      ]
    }
  }
  from: string
  id: string
  thid: string
  to: string
  typ: string
  type: string
}

export type ClaimOffer = {
  body: {
    credentials: [
      {
        description: string
        id: string
      },
    ]
    url: string
  }
  from: string
  id: string
  thid: string
  to: string
  typ: string
  type: string
}

export type Config = {
  RPC_URL_OR_RAW_PROVIDER: string | RawProvider
  ISSUER_API_URL: string
  STATE_V2_ADDRESS: string

  CIRCUIT_WASM_URL: string
  CIRCUIT_FINAL_KEY_URL: string

  CIRCUIT_LOADING_OPTS?: FetcherStandaloneConfig
}

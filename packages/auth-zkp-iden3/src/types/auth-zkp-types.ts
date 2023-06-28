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

export interface VerifiableCredentials {
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
        isMember: number
        serialNumber: number
        type: string
      }
      expirationDate: string
      id: string
      issuanceDate: string
      issuer: string
      proof?: [
        {
          coreClaim: string
          issuerData: IssuerData
          signature: string
          type: string
        },
        {
          coreClaim: string
          issuerData: IssuerData
          mtp: {
            existence: boolean
            siblings: string[]
          }
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

export type AuthZkpConfig = {
  RPC_URL: string
  ISSUER_API_URL: string
  STATE_V2_ADDRESS: string
  CIRCUIT_WASM_URL: string
  CIRCUIT_FINAL_KEY_URL: string
}

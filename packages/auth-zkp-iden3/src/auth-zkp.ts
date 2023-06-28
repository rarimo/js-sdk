import { JsonApiClient } from '@distributedlab/jac'
import { fromBigEndian } from '@iden3/js-iden3-core'
import { proving, Token } from '@iden3/js-jwz'
import { type Identity } from '@rarimo/identity-gen-iden3'

import { getGISTProof, readBytesFile } from '@/helpers'
import type {
  AuthClaimWithProof,
  AuthZkpConfig,
  ClaimOffer,
  IssuerResponse,
} from '@/types'

export class AuthZkp {
  identity: Identity = {} as Identity
  authClaimWithProof: AuthClaimWithProof = {} as AuthClaimWithProof
  issuerResponse: IssuerResponse = {} as IssuerResponse

  public static config: AuthZkpConfig = {
    RPC_URL: '',
    ISSUER_API_URL: '',
    STATE_V2_ADDRESS: '',
    CIRCUIT_WASM_URL:
      'https://raw.githubusercontent.com/rarimo/js-sdk/feature/zk-proof-flow/packages/auth-zkp-iden3/assets/auth/circuit.wasm',
    CIRCUIT_FINAL_KEY_URL:
      'https://raw.githubusercontent.com/rarimo/js-sdk/feature/zk-proof-flow/packages/auth-zkp-iden3/assets/auth/circuit_final.zkey',
  }

  public static setConfig(config: Partial<AuthZkpConfig>) {
    this.config = Object.assign(this.config, config)
  }

  constructor(identity: Identity) {
    this.identity = identity

    this.authClaimWithProof = {
      claim: {
        index: identity.authClaim.index.map(el => el.toBigInt().toString()),
        value: identity.authClaim.value.map(el => el.toBigInt().toString()),
      },
      treeState: identity.treeState,
      proofSiblings: identity.claimProofSiblings.map(el => el.string()),
      nonRevProof: {
        proofSiblings: identity.claimProofSiblings.map(el => el.string()),
        treeState: identity.treeState,
      },
    }
  }

  async getClaim() {
    const api = new JsonApiClient({
      baseUrl: AuthZkp.config.ISSUER_API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'omit',
    })

    const claimEndpoint = `/integrations/issuer/v1/public/claims/offers/${this.identity.identityIdString}/NaturalPerson`

    const { data: offerData } = await api.get<ClaimOffer>(claimEndpoint)

    const claimDetails = {
      id: offerData?.id,
      typ: offerData?.typ,
      type: 'https://iden3-communication.io/credentials/1.0/fetch-request',
      thid: offerData?.thid,
      body: {
        id: offerData?.body.credentials[0].id,
      },
      from: offerData?.to,
      to: offerData?.from,
    }

    const token2 = new Token(
      proving.provingMethodGroth16AuthV2Instance,
      JSON.stringify(claimDetails),
      this.prepareInputs.bind(this),
    )

    const [wasm, provingKey] = await Promise.all([
      readBytesFile(AuthZkp.config.CIRCUIT_WASM_URL),
      readBytesFile(AuthZkp.config.CIRCUIT_FINAL_KEY_URL),
    ])

    const jwzTokenRaw = await token2.prove(provingKey, wasm)

    const { rawData: issuerData } = await api
      .withBaseUrl(offerData.body.url)
      .post<IssuerResponse>('', {
        body: jwzTokenRaw,
      })

    if (!issuerData) throw new TypeError('Issuer response is empty')

    this.issuerResponse = issuerData as IssuerResponse

    return issuerData
  }

  async prepareInputs(messageHash: Uint8Array): Promise<Uint8Array> {
    const messageHashBigInt = fromBigEndian(messageHash)

    const signature = this.identity.privateKey.signPoseidon(messageHashBigInt)
    const gistInfo = await getGISTProof({
      rpcUrl: AuthZkp.config.RPC_URL,
      contractAddress: AuthZkp.config.STATE_V2_ADDRESS,
      userId: this.identity.identityIdBigIntString,
    })

    return new TextEncoder().encode(
      JSON.stringify({
        authClaim: [
          ...this.authClaimWithProof.claim.index,
          ...this.authClaimWithProof.claim.value,
        ],
        authClaimIncMtp: this.authClaimWithProof.proofSiblings,
        authClaimNonRevMtp: this.authClaimWithProof.proofSiblings,
        authClaimNonRevMtpAuxHi: '0',
        authClaimNonRevMtpAuxHv: '0',
        authClaimNonRevMtpNoAux: '1',
        challenge: messageHashBigInt.toString(),
        challengeSignatureR8x: signature.R8[0].toString(),
        challengeSignatureR8y: signature.R8[1].toString(),
        challengeSignatureS: signature.S.toString(),
        claimsTreeRoot: this.authClaimWithProof.treeState.claimsRoot,
        genesisID: this.identity.identityIdBigIntString,
        revTreeRoot: this.authClaimWithProof.treeState.revocationRoot,
        rootsTreeRoot: this.authClaimWithProof.treeState.rootOfRoots,
        state: this.authClaimWithProof.treeState.state,
        profileNonce: '0',
        gistRoot: gistInfo?.root.toString(),
        gistMtp:
          gistInfo?.siblings?.map?.((el: unknown) => el?.toString()) ?? [],
        gistMtpAuxHi: gistInfo?.auxIndex.toString(),
        gistMtpAuxHv: gistInfo?.auxValue.toString(),
        gistMtpNoAux: gistInfo?.auxExistence ? '0' : '1',
      }),
    )
  }
}

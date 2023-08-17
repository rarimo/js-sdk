import { JsonApiClient } from '@distributedlab/jac'
import { fromBigEndian } from '@iden3/js-iden3-core'
import { proving, Token } from '@iden3/js-jwz'
import { type Identity } from '@rarimo/identity-gen-iden3'
import { errors, getBytesFile, getGISTProof } from '@rarimo/shared-zkp-iden3'

import type {
  ClaimOffer,
  Config,
  QueryVariableNameAbstract,
  VerifiableCredentials,
} from '@/types'

let globalConfig: Config = {
  RPC_URL: '',
  ISSUER_API_URL: '',
  STATE_V2_ADDRESS: '',
  CIRCUIT_WASM_URL:
    'https://raw.githubusercontent.com/rarimo/js-sdk/feature/zk-proof-flow/packages/auth-zkp-iden3/assets/auth/circuit.wasm',
  CIRCUIT_FINAL_KEY_URL:
    'https://raw.githubusercontent.com/rarimo/js-sdk/feature/zk-proof-flow/packages/auth-zkp-iden3/assets/auth/circuit_final.zkey',
}

export class AuthZkp<T extends QueryVariableNameAbstract> {
  public identity: Identity = {} as Identity
  public verifiableCredentials: VerifiableCredentials<T> =
    {} as VerifiableCredentials<T>

  public circuitWasm?: Uint8Array
  public circuitZkey?: Uint8Array

  #api: JsonApiClient

  public static get config(): Config {
    return globalConfig
  }

  public static setConfig(config: Partial<Config>) {
    globalConfig = {
      ...globalConfig,
      ...config,
    }
  }

  constructor(identity: Identity) {
    this.identity = identity

    this.#api = new JsonApiClient({
      baseUrl: AuthZkp.config.ISSUER_API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'omit',
    })
  }

  public async preloadCircuits(): Promise<void> {
    const [wasm, zkey] = await Promise.all([
      getBytesFile(
        AuthZkp.config.CIRCUIT_WASM_URL,
        AuthZkp.config.CIRCUIT_LOADING_OPTS,
      ),
      getBytesFile(
        AuthZkp.config.CIRCUIT_FINAL_KEY_URL,
        AuthZkp.config.CIRCUIT_LOADING_OPTS,
      ),
    ])

    this.circuitWasm = wasm
    this.circuitZkey = zkey
  }

  public setCircuits(wasm: Uint8Array, zkey: Uint8Array) {
    this.circuitWasm = wasm
    this.circuitZkey = zkey
  }

  public async getVerifiableCredentials(
    claimSchemaType: string,
  ): Promise<VerifiableCredentials<T>> {
    const claimEndpoint = `/integrations/issuer/v1/public/claims/offers/${this.identity.idString}/${claimSchemaType}`

    const { data: offerData } = await this.#api.get<ClaimOffer>(claimEndpoint)

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

    const authZkpToken = new Token(
      proving.provingMethodGroth16AuthV2Instance,
      JSON.stringify(claimDetails),
      this.#prepareInputs.bind(this),
    )

    const [wasm, provingKey] = await Promise.all([
      this.circuitWasm ||
        getBytesFile(
          AuthZkp.config.CIRCUIT_WASM_URL,
          AuthZkp.config.CIRCUIT_LOADING_OPTS,
        ),
      this.circuitZkey ||
        getBytesFile(
          AuthZkp.config.CIRCUIT_FINAL_KEY_URL,
          AuthZkp.config.CIRCUIT_LOADING_OPTS,
        ),
    ])

    const jwzTokenRaw = await authZkpToken.prove(provingKey, wasm)

    const { rawData: issuerData } = await this.#api
      .withBaseUrl(offerData.body.url)
      .post<VerifiableCredentials<T>>('', {
        body: jwzTokenRaw,
      })

    if (!issuerData)
      throw new errors.IssuerResponseEmptyError(
        `Issuer response by ${offerData.body.url} is empty`,
      )

    this.verifiableCredentials =
      issuerData as unknown as VerifiableCredentials<T>

    return issuerData as unknown as VerifiableCredentials<T>
  }

  async #prepareInputs(messageHash: Uint8Array): Promise<Uint8Array> {
    const messageHashBigInt = fromBigEndian(messageHash)

    const signature = this.identity.privateKey.signPoseidon(messageHashBigInt)
    const gistInfo = await getGISTProof({
      ...(AuthZkp.config.RAW_PROVIDER
        ? { rawProvider: AuthZkp.config.RAW_PROVIDER }
        : AuthZkp.config.RPC_URL
        ? { rpcUrl: AuthZkp.config.RPC_URL }
        : {}),
      contractAddress: AuthZkp.config.STATE_V2_ADDRESS,
      userId: this.identity.idBigIntString,
    })

    const preparedInputs = {
      authClaim: [...this.identity.authClaimInput],
      authClaimIncMtp: [
        ...this.identity.authClaimIncProofSiblings.map(el => el.string()),
      ],
      authClaimNonRevMtp: [
        ...this.identity.authClaimNonRevProofSiblings.map(el => el.string()),
      ],
      authClaimNonRevMtpAuxHi: '0',
      authClaimNonRevMtpAuxHv: '0',
      authClaimNonRevMtpNoAux: '1',
      challenge: messageHashBigInt.toString(),
      challengeSignatureR8x: signature.R8[0].toString(),
      challengeSignatureR8y: signature.R8[1].toString(),
      challengeSignatureS: signature.S.toString(),
      claimsTreeRoot: this.identity.treeState.claimsRoot,
      genesisID: this.identity.idBigIntString,
      revTreeRoot: this.identity.treeState.revocationRoot,
      rootsTreeRoot: this.identity.treeState.rootOfRoots,
      state: this.identity.treeState.state,
      profileNonce: '0',
      gistRoot: gistInfo?.root.toString(),
      gistMtp: gistInfo?.siblings?.map?.((el: unknown) => el?.toString()) ?? [],
      gistMtpAuxHi: gistInfo?.auxIndex.toString(),
      gistMtpAuxHv: gistInfo?.auxValue.toString(),
      gistMtpNoAux: gistInfo?.auxExistence ? '0' : '1',
    }

    return new TextEncoder().encode(JSON.stringify(preparedInputs))
  }
}

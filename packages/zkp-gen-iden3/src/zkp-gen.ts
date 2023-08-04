import { fetcher } from '@distributedlab/fetcher'
import { arrayify } from '@ethersproject/bytes'
import { keccak256 } from '@ethersproject/keccak256'
import { Hex, Signature } from '@iden3/js-crypto'
import {
  Claim,
  ClaimOptions,
  DID,
  fromLittleEndian,
  SchemaHash,
} from '@iden3/js-iden3-core'
import {
  Merklizer,
  type MtValue,
  type Path,
} from '@iden3/js-jsonld-merklization'
import { proving, type ZKProof } from '@iden3/js-jwz'
import {
  circomSiblingsFromSiblings,
  newHashFromHex,
  Proof,
} from '@iden3/js-merkletree'
import type { VerifiableCredentials } from '@rarimo/auth-zkp-iden3'
import { type Identity } from '@rarimo/identity-gen-iden3'
import { omit } from '@rarimo/shared'
import {
  getBytesFile,
  getGISTProof,
  unmarshalBinary,
} from '@rarimo/shared-zkp-iden3'
import { Buffer } from 'buffer'
import type { BigNumber } from 'ethers'

import { CircuitId } from '@/enums'
import { ensureArraySize, getNodeAuxValue } from '@/helpers'
import type {
  ClaimStatus,
  Config,
  QueryVariableNameAbstract,
  Schema,
  ZkpGenCreateOpts,
  ZkpGenQuery,
} from '@/types'

let globalConfig: Config = {
  RPC_URL: '',
  RAW_PROVIDER: undefined,
  ISSUER_API_URL: '',
  STATE_V2_ADDRESS: '',
  CIRCUIT_WASM_URL:
    'https://raw.githubusercontent.com/rarimo/js-sdk/feature/zk-proof-flow/packages/zkp-gen-iden3/assets/credentials/circuit.wasm',
  CIRCUIT_FINAL_KEY_URL:
    'https://raw.githubusercontent.com/rarimo/js-sdk/feature/zk-proof-flow/packages/zkp-gen-iden3/assets/credentials/circuit_final.zkey',

  CIRCUIT_SIG_V2_ON_CHAIN_WASM_URL:
    'https://raw.githubusercontent.com/rarimo/js-sdk/feature/zk-proof-flow/packages/zkp-gen-iden3/assets/credentialAtomicQuerySigV2OnChain/circuit.wasm',
  CIRCUIT_SIG_V2_ON_CHAIN_FINAL_KEY_URL:
    'https://raw.githubusercontent.com/rarimo/js-sdk/feature/zk-proof-flow/packages/zkp-gen-iden3/assets/credentialAtomicQuerySigV2OnChain/circuit_final.zkey',

  CIRCUIT_SIG_V2_WASM_URL:
    'https://raw.githubusercontent.com/rarimo/js-sdk/feature/zk-proof-flow/packages/zkp-gen-iden3/assets/credentialAtomicQuerySigV2/circuit.wasm',
  CIRCUIT_SIG_V2_FINAL_KEY_URL:
    'https://raw.githubusercontent.com/rarimo/js-sdk/feature/zk-proof-flow/packages/zkp-gen-iden3/assets/credentialAtomicQuerySigV2/circuit_final.zkey',

  CIRCUIT_MTP_V2_WASM_URL:
    'https://raw.githubusercontent.com/rarimo/js-sdk/feature/zk-proof-flow/packages/zkp-gen-iden3/assets/credentialAtomicQueryMTPV2/circuit.wasm',
  CIRCUIT_MTP_V2_FINAL_KEY_URL:
    'https://raw.githubusercontent.com/rarimo/js-sdk/feature/zk-proof-flow/packages/zkp-gen-iden3/assets/credentialAtomicQueryMTPV2/circuit_final.zkey',

  CIRCUIT_MTP_V2_ON_CHAIN_WASM_URL:
    'https://raw.githubusercontent.com/Electr1Xx/circuits/main/credentialAtomicQueryMTPV2OnChain/circuit.wasm',
  CIRCUIT_MTP_V2_ON_CHAIN_FINAL_KEY_URL:
    'https://raw.githubusercontent.com/Electr1Xx/circuits/main/credentialAtomicQueryMTPV2OnChain/circuit_final.zkey',

  CLAIM_PROOF_SIBLINGS_COUNT: 32,
}

export class ZkpGen<T extends QueryVariableNameAbstract> {
  public requestId = ''
  public identity: Identity = {} as Identity
  public query: ZkpGenQuery<T> = {} as ZkpGenQuery<T>
  public verifiableCredentials: VerifiableCredentials<T> =
    {} as VerifiableCredentials<T>

  public challenge = ''

  public subjectProof: ZKProof = {} as ZKProof

  public static get config() {
    return globalConfig
  }

  public static setConfig(config: Partial<Config>) {
    globalConfig = { ...globalConfig, ...config }
  }

  constructor(opts: ZkpGenCreateOpts<T>) {
    this.requestId = opts.requestId
    this.identity = opts.identity
    this.verifiableCredentials = opts.verifiableCredentials

    this.challenge = opts.challenge

    this.query = opts.query
  }

  async generateProof() {
    const inputs = await this.#prepareInputs()

    const CIRCUIT_FILES_URLS_MAP: Record<
      CircuitId,
      { wasm: string; zkey: string }
    > = {
      [CircuitId.AtomicQueryMTPV2]: {
        wasm: ZkpGen.config.CIRCUIT_MTP_V2_WASM_URL,
        zkey: ZkpGen.config.CIRCUIT_MTP_V2_FINAL_KEY_URL,
      },
      [CircuitId.AtomicQueryMTPV2OnChain]: {
        wasm: ZkpGen.config.CIRCUIT_MTP_V2_ON_CHAIN_WASM_URL,
        zkey: ZkpGen.config.CIRCUIT_MTP_V2_ON_CHAIN_FINAL_KEY_URL,
      },
      [CircuitId.AtomicQuerySigV2]: {
        wasm: ZkpGen.config.CIRCUIT_SIG_V2_WASM_URL,
        zkey: ZkpGen.config.CIRCUIT_SIG_V2_FINAL_KEY_URL,
      },
      [CircuitId.AtomicQuerySigV2OnChain]: {
        wasm: ZkpGen.config.CIRCUIT_SIG_V2_ON_CHAIN_WASM_URL,
        zkey: ZkpGen.config.CIRCUIT_SIG_V2_ON_CHAIN_FINAL_KEY_URL,
      },
    }

    const [wasm, provingKey] = await Promise.all([
      getBytesFile(CIRCUIT_FILES_URLS_MAP[this.query.circuitId].wasm),
      getBytesFile(CIRCUIT_FILES_URLS_MAP[this.query.circuitId].zkey),
    ])

    this.subjectProof = await proving.provingMethodGroth16AuthV2Instance.prove(
      new TextEncoder().encode(inputs),
      provingKey,
      wasm,
    )

    return this.subjectProof
  }

  async #prepareInputs() {
    // ==================== USER SIDE ======================
    const challenge = fromLittleEndian(Hex.decodeString(this.challenge))

    const signatureChallenge = this.identity.privateKey.signPoseidon(challenge)

    const gistInfo = await getGISTProof({
      ...(ZkpGen.config.RAW_PROVIDER
        ? { rawProvider: ZkpGen.config.RAW_PROVIDER }
        : ZkpGen.config.RPC_URL
        ? { rpcUrl: ZkpGen.config.RPC_URL }
        : {}),
      contractAddress: ZkpGen.config.STATE_V2_ADDRESS,
      userId: this.identity.idBigIntString,
    })

    // ==================== ISSUER SIDE ======================

    const issuerClaimNonRevMtp = await this.#requestClaimRevocationStatus(
      this.verifiableCredentials.body.credential.credentialStatus.id,
    )

    const issuerClaimNonRevMtpAux = getNodeAuxValue(issuerClaimNonRevMtp.mtp)

    const issuerID = DID.parse(this.verifiableCredentials.from).id

    const sigProof = await this.#parseBJJSignatureProof()
    const mtpProof = await this.#parseMTPProof()

    const {
      path,
      coreClaim: coreClaimFromIssuer,
      claimProof,
    } = await this.#createCoreClaimFromIssuer()

    const claimPathMtpAux = getNodeAuxValue(claimProof.proof)

    // ==================== SETUP SIDE ======================

    const timestamp = Math.floor(Date.now() / 1000)

    const value = new Array(64)
    value.fill('0')
    value[0] = Number(
      this.verifiableCredentials.body.credential.credentialSubject?.[
        this.query.variableName
      ],
    ).toString()

    const authClaimNonRevMtpAux = getNodeAuxValue(
      this.identity.authClaimNonRevProof,
    )

    const commonInputs = {
      /* we have no constraints for "requestID" in this circuit, it is used as a unique identifier for the request */
      /* and verifier can use it to identify the request, and verify the proof of specific request in case of multiple query requests */
      requestID: this.requestId,

      /* userID ownership signals */
      userGenesisID: this.identity.idBigIntString,
      profileNonce: '0',

      /* issuerClaim signals */
      claimSubjectProfileNonce: '0',

      /* issuer ID */
      issuerID: issuerID.bigInt().toString(),

      /* current time */
      timestamp,

      /* Query */
      claimSchema: coreClaimFromIssuer.getSchemaHash().bigInt().toString(),

      claimPathNotExists: '0',
      claimPathMtp: ensureArraySize(
        claimProof.proof.siblings.map(el => el.string()),
        32,
      ),
      claimPathMtpNoAux: claimPathMtpAux.noAux,
      claimPathMtpAuxHi: claimPathMtpAux.key.string(),
      claimPathMtpAuxHv: claimPathMtpAux.value.string(),
      claimPathKey: (await path.mtEntry()).toString(),
      claimPathValue: claimProof.value?.value,

      slotIndex: '0',
      operator: this.query.operator,
      value: value,

      /* claim issued by issuer to the user */
      issuerClaim: [
        ...coreClaimFromIssuer.index.map(el => el.toBigInt().toString()),
        ...coreClaimFromIssuer.value.map(el => el.toBigInt().toString()),
      ],
      /* issuerClaim non rev inputs */
      isRevocationChecked: '1',
      issuerClaimNonRevMtp: ensureArraySize(
        issuerClaimNonRevMtp.mtp.siblings,
        40,
      ),
      issuerClaimNonRevMtpNoAux: issuerClaimNonRevMtpAux.noAux,
      issuerClaimNonRevMtpAuxHi: issuerClaimNonRevMtpAux.key.string(),
      issuerClaimNonRevMtpAuxHv: issuerClaimNonRevMtpAux.value.string(),
      issuerClaimNonRevClaimsTreeRoot: newHashFromHex(
        String(issuerClaimNonRevMtp.issuer.claimsTreeRoot),
      ).string(),
      issuerClaimNonRevRevTreeRoot: newHashFromHex(
        String(issuerClaimNonRevMtp.issuer.revocationTreeRoot),
      ).string(),
      issuerClaimNonRevRootsTreeRoot: newHashFromHex(
        String(issuerClaimNonRevMtp.issuer.rootOfRoots),
      ).string(),
      issuerClaimNonRevState: newHashFromHex(
        String(issuerClaimNonRevMtp.issuer.state),
      ).string(),
    }

    const preparedInputs: Record<CircuitId, Record<string, unknown>> = {
      [CircuitId.AtomicQueryMTPV2]: {
        ...commonInputs,

        // FIXME
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        issuerClaimMtp: ensureArraySize(
          mtpProof.issuerClaimIncMtp.mtp.siblings,
          40,
        ),
        issuerClaimClaimsTreeRoot:
          mtpProof.issuerClaimIncMtp.issuer.claimsTreeRoot,
        issuerClaimRevTreeRoot:
          mtpProof.issuerClaimIncMtp.issuer.revocationTreeRoot,
        issuerClaimRootsTreeRoot: mtpProof.issuerClaimIncMtp.issuer.rootOfRoots,
        issuerClaimIdenState: mtpProof.issuerClaimIncMtp.issuer.state,
      },
      [CircuitId.AtomicQueryMTPV2OnChain]: {
        ...commonInputs,

        /* user state */
        userState: this.identity.treeState.state,
        userClaimsTreeRoot: this.identity.treeState.claimsRoot,
        userRevTreeRoot: this.identity.treeState.revocationRoot,
        userRootsTreeRoot: this.identity.treeState.rootOfRoots,

        /* Auth claim */
        authClaim: [...this.identity.authClaimInput],

        /* auth claim. merkle tree proof of inclusion to claim tree */
        authClaimIncMtp: [
          ...this.identity.authClaimIncProofSiblings.map(el => el.string()),
        ],

        /* auth claim - rev nonce. merkle tree proof of non-inclusion to rev tree */
        authClaimNonRevMtp: [
          ...this.identity.authClaimNonRevProofSiblings.map(el => el.string()),
        ],
        authClaimNonRevMtpNoAux: authClaimNonRevMtpAux.noAux,
        authClaimNonRevMtpAuxHi: authClaimNonRevMtpAux.key.string(),
        authClaimNonRevMtpAuxHv: authClaimNonRevMtpAux.value.string(),

        /* challenge signature */
        challenge: challenge.toString(),
        challengeSignatureR8x: signatureChallenge!.R8[0].toString(),
        challengeSignatureR8y: signatureChallenge!.R8[1].toString(),
        challengeSignatureS: signatureChallenge!.S.toString(),

        // global identity state tree on chain
        gistRoot: gistInfo?.root.toString(),
        /* proof of inclusion or exclusion of the user in the global state */
        gistMtp: ensureArraySize(
          gistInfo?.siblings.map((el: BigNumber) => el.toString()),
          64,
        ),
        gistMtpAuxHi: gistInfo?.auxIndex.toString(),
        gistMtpAuxHv: gistInfo?.auxValue.toString(),
        gistMtpNoAux: gistInfo?.auxExistence ? '0' : '1',

        issuerClaimMtp: ensureArraySize(
          mtpProof.issuerClaimIncMtp.mtp.siblings,
          40,
        ),
        issuerClaimClaimsTreeRoot:
          mtpProof.issuerClaimIncMtp.issuer.claimsTreeRoot,
        issuerClaimRevTreeRoot:
          mtpProof.issuerClaimIncMtp.issuer.revocationTreeRoot,
        issuerClaimRootsTreeRoot: mtpProof.issuerClaimIncMtp.issuer.rootOfRoots,
        issuerClaimIdenState: mtpProof.issuerClaimIncMtp.issuer.state,
      },
      [CircuitId.AtomicQuerySigV2]: {
        ...commonInputs,

        /* issuer auth proof of existence */
        issuerAuthClaim: sigProof.issuerAuthClaim,
        issuerAuthClaimMtp: ensureArraySize(
          sigProof.issuerAuthClaimIncMtp.mtp.siblings,
          40,
        ),
        issuerAuthClaimsTreeRoot:
          sigProof.issuerAuthClaimIncMtp.issuer.claimsTreeRoot,
        issuerAuthRevTreeRoot:
          sigProof.issuerAuthClaimIncMtp.issuer.revocationTreeRoot,
        issuerAuthRootsTreeRoot:
          sigProof.issuerAuthClaimIncMtp.issuer.rootOfRoots,
        // issuerAuthState: signatureProof.issuerState.state.string(),

        /* issuer auth claim non rev proof */
        issuerAuthClaimNonRevMtp: ensureArraySize(
          sigProof.issuerAuthClaimNonRevMtp.mtp.siblings,
          40,
        ),
        issuerAuthClaimNonRevMtpNoAux:
          sigProof.issuerAuthClaimNonRevMtpAux.noAux,
        issuerAuthClaimNonRevMtpAuxHi:
          sigProof.issuerAuthClaimNonRevMtpAux.key.string(),
        issuerAuthClaimNonRevMtpAuxHv:
          sigProof.issuerAuthClaimNonRevMtpAux.value.string(),

        /* issuerClaim signature */
        issuerClaimSignatureR8x: sigProof.signature.R8[0].toString(),
        issuerClaimSignatureR8y: sigProof.signature.R8[1].toString(),
        issuerClaimSignatureS: sigProof.signature.S.toString(),
      },
      [CircuitId.AtomicQuerySigV2OnChain]: {
        ...commonInputs,

        /* user state */
        userState: this.identity.treeState.state,
        userClaimsTreeRoot: this.identity.treeState.claimsRoot,
        userRevTreeRoot: this.identity.treeState.revocationRoot,
        userRootsTreeRoot: this.identity.treeState.rootOfRoots,

        /* Auth claim */
        authClaim: [...this.identity.authClaimInput],

        /* auth claim. merkle tree proof of inclusion to claim tree */
        authClaimIncMtp: [
          ...this.identity.authClaimIncProofSiblings.map(el => el.string()),
        ],

        /* auth claim - rev nonce. merkle tree proof of non-inclusion to rev tree */
        authClaimNonRevMtp: [
          ...this.identity.authClaimNonRevProofSiblings.map(el => el.string()),
        ],
        authClaimNonRevMtpNoAux: authClaimNonRevMtpAux.noAux,
        authClaimNonRevMtpAuxHi: authClaimNonRevMtpAux.key.string(),
        authClaimNonRevMtpAuxHv: authClaimNonRevMtpAux.value.string(),

        /* challenge signature */
        challenge: challenge.toString(),
        challengeSignatureR8x: signatureChallenge!.R8[0].toString(),
        challengeSignatureR8y: signatureChallenge!.R8[1].toString(),
        challengeSignatureS: signatureChallenge!.S.toString(),

        // global identity state tree on chain
        gistRoot: gistInfo?.root.toString(),
        /* proof of inclusion or exclusion of the user in the global state */
        gistMtp: ensureArraySize(
          gistInfo?.siblings.map((el: BigNumber) => el.toString()),
          64,
        ),
        gistMtpAuxHi: gistInfo?.auxIndex.toString(),
        gistMtpAuxHv: gistInfo?.auxValue.toString(),
        gistMtpNoAux: gistInfo?.auxExistence ? '0' : '1',

        /* issuer auth proof of existence */
        issuerAuthClaim: sigProof.issuerAuthClaim,
        issuerAuthClaimMtp: ensureArraySize(
          sigProof.issuerAuthClaimIncMtp.mtp.siblings,
          40,
        ),
        issuerAuthClaimsTreeRoot:
          sigProof.issuerAuthClaimIncMtp.issuer.claimsTreeRoot,
        issuerAuthRevTreeRoot:
          sigProof.issuerAuthClaimIncMtp.issuer.revocationTreeRoot,
        issuerAuthRootsTreeRoot:
          sigProof.issuerAuthClaimIncMtp.issuer.rootOfRoots,
        // issuerAuthState: signatureProof.issuerState.state.string(),

        /* issuer auth claim non rev proof */
        issuerAuthClaimNonRevMtp: ensureArraySize(
          sigProof.issuerAuthClaimNonRevMtp.mtp.siblings,
          40,
        ),
        issuerAuthClaimNonRevMtpNoAux:
          sigProof.issuerAuthClaimNonRevMtpAux.noAux,
        issuerAuthClaimNonRevMtpAuxHi:
          sigProof.issuerAuthClaimNonRevMtpAux.key.string(),
        issuerAuthClaimNonRevMtpAuxHv:
          sigProof.issuerAuthClaimNonRevMtpAux.value.string(),

        /* issuerClaim signature */
        issuerClaimSignatureR8x: sigProof.signature.R8[0].toString(),
        issuerClaimSignatureR8y: sigProof.signature.R8[1].toString(),
        issuerClaimSignatureS: sigProof.signature.S.toString(),
      },
    }[this.query.circuitId]

    return JSON.stringify(preparedInputs)
  }

  async #createCoreClaimFromIssuer(): Promise<{
    path: Path
    coreClaim: Claim
    claimProof: {
      proof: Proof
      value?: MtValue
    }
  }> {
    const schemaHash = await this.#getSchemaHash()

    const credential = omit({ ...this.verifiableCredentials.body.credential }, [
      'proof',
    ])

    const mz = await Merklizer.merklizeJSONLD(JSON.stringify(credential))
    const path: Path = await mz.resolveDocPath(
      `credentialSubject.${String(this.query.variableName)}`,
    )
    const claimProof = await mz.proof(path)

    claimProof.proof.siblings = circomSiblingsFromSiblings(
      claimProof.proof.siblings,
      ZkpGen.config.CLAIM_PROOF_SIBLINGS_COUNT,
    )

    const coreClaim = Claim.newClaim(
      schemaHash,
      ClaimOptions.withValueMerklizedRoot((await mz.root()).bigInt()),
      ClaimOptions.withIndexId(this.identity.id),
      ClaimOptions.withRevocationNonce(
        BigInt(
          this.verifiableCredentials.body.credential.credentialStatus
            .revocationNonce,
        ),
      ),
    )

    return { path, coreClaim, claimProof }
  }

  async #getSchemaHash(): Promise<SchemaHash> {
    const { data } = await fetcher.get<Schema>(
      this.verifiableCredentials.body.credential.credentialSchema.id,
    )
    const schemaString = `${data?.$metadata.uris.jsonLdContext}#${this.verifiableCredentials.body.credential.credentialSubject.type}`
    const schemaBytes = new TextEncoder().encode(schemaString)
    const keccakString = arrayify(keccak256(Buffer.from(schemaBytes)))
    return new SchemaHash(keccakString.subarray(keccakString.byteLength - 16))
  }

  async #requestClaimRevocationStatus(url: string) {
    const { data } = await fetcher.get(url)

    return data as ClaimStatus
  }

  async #parseBJJSignatureProof() {
    const [credentialSigProof] =
      this.verifiableCredentials.body.credential.proof!

    const issuerAuthClaimIncMtp = await this.#requestClaimRevocationStatus(
      credentialSigProof.issuerProofUpdateUrl,
    )

    issuerAuthClaimIncMtp.issuer = {
      claimsTreeRoot: (typeof issuerAuthClaimIncMtp.issuer.claimsTreeRoot ===
      'string'
        ? newHashFromHex(issuerAuthClaimIncMtp.issuer.claimsTreeRoot)
        : issuerAuthClaimIncMtp.issuer.claimsTreeRoot
      ).string(),
      revocationTreeRoot: (typeof issuerAuthClaimIncMtp.issuer
        .revocationTreeRoot === 'string'
        ? newHashFromHex(issuerAuthClaimIncMtp.issuer.revocationTreeRoot)
        : issuerAuthClaimIncMtp.issuer.revocationTreeRoot
      ).string(),
      rootOfRoots: (typeof issuerAuthClaimIncMtp.issuer.rootOfRoots === 'string'
        ? newHashFromHex(issuerAuthClaimIncMtp.issuer.rootOfRoots)
        : issuerAuthClaimIncMtp.issuer.rootOfRoots
      ).string(),
      state: (typeof issuerAuthClaimIncMtp.issuer.state === 'string'
        ? newHashFromHex(issuerAuthClaimIncMtp.issuer.state)
        : issuerAuthClaimIncMtp.issuer.state
      ).string(),
    }

    const issuerAuthClaimNonRevMtp = await this.#requestClaimRevocationStatus(
      credentialSigProof.issuerData.credentialStatus.id,
    )

    issuerAuthClaimNonRevMtp.issuer = {
      claimsTreeRoot: (typeof issuerAuthClaimNonRevMtp.issuer.claimsTreeRoot ===
      'string'
        ? newHashFromHex(issuerAuthClaimNonRevMtp.issuer.claimsTreeRoot)
        : issuerAuthClaimNonRevMtp.issuer.claimsTreeRoot
      ).string(),
      revocationTreeRoot: (typeof issuerAuthClaimNonRevMtp.issuer
        .revocationTreeRoot === 'string'
        ? newHashFromHex(issuerAuthClaimNonRevMtp.issuer.revocationTreeRoot)
        : issuerAuthClaimNonRevMtp.issuer.revocationTreeRoot
      ).string(),
      rootOfRoots: (typeof issuerAuthClaimNonRevMtp.issuer.rootOfRoots ===
      'string'
        ? newHashFromHex(issuerAuthClaimNonRevMtp.issuer.rootOfRoots)
        : issuerAuthClaimNonRevMtp.issuer.rootOfRoots
      ).string(),
      state: (typeof issuerAuthClaimNonRevMtp.issuer.state === 'string'
        ? newHashFromHex(issuerAuthClaimNonRevMtp.issuer.state)
        : issuerAuthClaimNonRevMtp.issuer.state
      ).string(),
    }

    const decodedSignature = Hex.decodeString(credentialSigProof.signature)
    const signature = Signature.newFromCompressed(decodedSignature)

    const issuerAuthClaimNonRevMtpAux = getNodeAuxValue(
      issuerAuthClaimNonRevMtp.mtp,
    )

    return {
      proof: issuerAuthClaimNonRevMtp.mtp,

      issuerAuthClaimNonRevMtp,
      issuerAuthClaimIncMtp,

      signature: signature,

      // FIXME: remove
      issuerAuthClaim: unmarshalBinary(
        Hex.decodeString(credentialSigProof.issuerData.authCoreClaim),
      ),

      issuerAuthClaimNonRevMtpAux,
    }
  }

  async #parseMTPProof() {
    const [, mtpProof] = this.verifiableCredentials.body.credential.proof!

    const issuerClaimIncMtp = await this.#requestClaimRevocationStatus(
      mtpProof.id,
    )

    issuerClaimIncMtp.issuer = {
      claimsTreeRoot: (typeof issuerClaimIncMtp.issuer.claimsTreeRoot ===
      'string'
        ? newHashFromHex(issuerClaimIncMtp.issuer.claimsTreeRoot)
        : issuerClaimIncMtp.issuer.claimsTreeRoot
      ).string(),
      revocationTreeRoot: (typeof issuerClaimIncMtp.issuer
        .revocationTreeRoot === 'string'
        ? newHashFromHex(issuerClaimIncMtp.issuer.revocationTreeRoot)
        : issuerClaimIncMtp.issuer.revocationTreeRoot
      ).string(),
      rootOfRoots: (typeof issuerClaimIncMtp.issuer.rootOfRoots === 'string'
        ? newHashFromHex(issuerClaimIncMtp.issuer.rootOfRoots)
        : issuerClaimIncMtp.issuer.rootOfRoots
      ).string(),
      state: (typeof issuerClaimIncMtp.issuer.state === 'string'
        ? newHashFromHex(issuerClaimIncMtp.issuer.state)
        : issuerClaimIncMtp.issuer.state
      ).string(),
    }

    return {
      proof: issuerClaimIncMtp.mtp,

      issuerClaimIncMtp,
    }
  }
}

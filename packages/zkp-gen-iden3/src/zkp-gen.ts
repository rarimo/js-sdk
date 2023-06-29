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
  hashElems,
  newHashFromHex,
  Proof,
} from '@iden3/js-merkletree'
import type { VerifiableCredentials } from '@rarimo/auth-zkp-iden3'
import { type Identity } from '@rarimo/identity-gen-iden3'
import { Buffer } from 'buffer'
import type { BigNumber } from 'ethers'
import omit from 'lodash/omit'

import { getGISTProof, readBytesFile, unmarshalBinary } from '@/helpers'
import type {
  ClaimStatus,
  IssuerState,
  QueryVariableNameAbstract,
  Schema,
  ZkpGenCreateOpts,
  ZkpGenQuery,
} from '@/types'

const ensureArraySize = (arr: string[], size: number): string[] => {
  if (arr.length < size) {
    const newArr = new Array(size - arr.length).fill('0')
    return arr.concat(newArr)
  }
  return arr
}

export class ZkpGen<T extends QueryVariableNameAbstract> {
  requestId = ''
  identity: Identity = {} as Identity
  query: ZkpGenQuery<T> = {} as ZkpGenQuery<T>
  verifiableCredentials: VerifiableCredentials<T> =
    {} as VerifiableCredentials<T>

  challenge = ''

  subjectProof: ZKProof = {} as ZKProof

  public static config = {
    RPC_URL: '',
    ISSUER_API_URL: '',
    STATE_V2_ADDRESS: '',
    CIRCUIT_WASM_URL:
      'https://raw.githubusercontent.com/rarimo/js-sdk/feature/zk-proof-flow/packages/zkp-gen-iden3/assets/credentials/circuit.wasm',
    CIRCUIT_FINAL_KEY_URL:
      'https://raw.githubusercontent.com/rarimo/js-sdk/feature/zk-proof-flow/packages/zkp-gen-iden3/assets/credentials/circuit_final.zkey',
    CLAIM_PROOF_SIBLINGS_COUNT: 32,
  }

  public static setConfig(config: Partial<typeof ZkpGen.config>) {
    this.config = Object.assign(this.config, config)
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

    const [wasm, provingKey] = await Promise.all([
      readBytesFile(ZkpGen.config.CIRCUIT_WASM_URL),
      readBytesFile(ZkpGen.config.CIRCUIT_FINAL_KEY_URL),
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
      rpcUrl: ZkpGen.config.RPC_URL,
      contractAddress: ZkpGen.config.STATE_V2_ADDRESS,
      userId: this.identity.identityIdBigIntString,
    })

    const userClaimStatus = await this.#requestClaimRevocationStatus(
      this.verifiableCredentials.body.credential.credentialStatus
        .revocationNonce,
    )

    // ==================== ISSUER SIDE ======================

    const [credentialSigProof] =
      this.verifiableCredentials.body.credential.proof!

    const issuerAuthCoreClaim = new Claim()
    issuerAuthCoreClaim.fromHex(credentialSigProof.coreClaim)

    const issuerRevNonce = issuerAuthCoreClaim.getRevocationNonce()

    const issuerAuthClaimStatus = await this.#requestClaimRevocationStatus(
      Number(issuerRevNonce),
    )

    const issuerID = DID.parse(this.verifiableCredentials.from).id
    const signatureProof = this.#parseBJJSignatureProof()

    const {
      path,
      coreClaim: coreClaimFromIssuer,
      claimProof,
    } = await this.#createCoreClaimFromIssuer()

    // ==================== SETUP SIDE ======================

    const timestamp = Math.floor(Date.now() / 1000)

    const value = new Array(64)
    value.fill('0')
    value[0] =
      this.verifiableCredentials.body.credential.credentialSubject?.[
        this.query.variableName
      ].toString()

    return JSON.stringify({
      /* we have no constraints for "requestID" in this circuit, it is used as a unique identifier for the request */
      /* and verifier can use it to identify the request, and verify the proof of specific request in case of multiple query requests */
      requestID: this.requestId,

      /* userID ownership signals */
      userGenesisID: this.identity.identityIdBigIntString,
      profileNonce: '0',

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
      authClaimNonRevMtpNoAux: '1',
      authClaimNonRevMtpAuxHi: '0',
      authClaimNonRevMtpAuxHv: '0',

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

      /* issuerClaim signals */
      claimSubjectProfileNonce: '0',

      /* issuer ID */
      issuerID: issuerID.bigInt().toString(),

      /* issuer auth proof of existence */
      issuerAuthClaim: signatureProof.issuerAuthClaim,
      issuerAuthClaimMtp: signatureProof.issuerAuthClaimIncProof,
      issuerAuthClaimsTreeRoot: signatureProof.claimsTreeRoot.string(),
      issuerAuthRevTreeRoot: signatureProof.revocationTreeRoot.string(),
      issuerAuthRootsTreeRoot: signatureProof.rootOfRoots.string(),
      // issuerAuthState: signatureProof.issuerState.state.string(),

      /* issuer auth claim non rev proof */
      issuerAuthClaimNonRevMtp: ensureArraySize(
        issuerAuthClaimStatus.mtp.siblings.map(el => el.string()),
        40,
      ),
      issuerAuthClaimNonRevMtpNoAux: '1',
      issuerAuthClaimNonRevMtpAuxHi: '0',
      issuerAuthClaimNonRevMtpAuxHv: '0',

      /* claim issued by issuer to the user */
      issuerClaim: [
        ...coreClaimFromIssuer.index.map(el => el.toBigInt().toString()),
        ...coreClaimFromIssuer.value.map(el => el.toBigInt().toString()),
      ],
      /* issuerClaim non rev inputs */
      isRevocationChecked: '1',
      issuerClaimNonRevMtp: ensureArraySize(
        userClaimStatus.mtp.siblings.map(el => el.string()),
        40,
      ),
      issuerClaimNonRevMtpNoAux:
        !!userClaimStatus.mtp?.nodeAux?.key &&
        !!userClaimStatus.mtp?.nodeAux?.value
          ? 0
          : 1,
      issuerClaimNonRevMtpAuxHi: userClaimStatus.mtp?.nodeAux?.key ?? 0,
      issuerClaimNonRevMtpAuxHv: userClaimStatus.mtp?.nodeAux?.value ?? 0,
      issuerClaimNonRevClaimsTreeRoot: newHashFromHex(
        String(userClaimStatus.issuer.claimsTreeRoot),
      ).string(),
      issuerClaimNonRevRevTreeRoot: newHashFromHex(
        String(userClaimStatus.issuer.revocationTreeRoot),
      ).string(),
      issuerClaimNonRevRootsTreeRoot: newHashFromHex(
        String(userClaimStatus.issuer.rootOfRoots),
      ).string(),
      issuerClaimNonRevState: newHashFromHex(
        String(userClaimStatus.issuer.state),
      ).string(),

      /* issuerClaim signature */
      issuerClaimSignatureR8x: signatureProof.signature.R8[0].toString(),
      issuerClaimSignatureR8y: signatureProof.signature.R8[1].toString(),
      issuerClaimSignatureS: signatureProof.signature.S.toString(),

      /* current time */
      timestamp,

      /* Query */
      claimSchema: coreClaimFromIssuer.getSchemaHash().bigInt().toString(),

      claimPathNotExists: '0',
      claimPathMtp: ensureArraySize(
        claimProof.proof.siblings.map(el => el.string()),
        32,
      ),
      claimPathMtpNoAux: '0',
      claimPathMtpAuxHi: '0',
      claimPathMtpAuxHv: '0',
      claimPathKey: (await path.mtEntry()).toString(),
      claimPathValue: claimProof.value?.value,

      slotIndex: '0',
      operator: this.query.operator,
      value: value,
    })
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
      ClaimOptions.withIndexId(this.identity.identityId),
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

  async #requestClaimRevocationStatus(revNonce: number) {
    const { data } = await fetcher.get(
      `${ZkpGen.config.ISSUER_API_URL}/integrations/issuer/v1/public/claims/revocations/check/${revNonce}`,
    )

    return data as ClaimStatus
  }

  #parseBJJSignatureProof() {
    const [credentialSigProof] =
      this.verifiableCredentials.body.credential.proof!

    const issuerData = credentialSigProof.issuerData.state

    const claimsTreeRoot = newHashFromHex(String(issuerData.claimsTreeRoot))
    const revocationTreeRoot = newHashFromHex(
      String(issuerData.revocationTreeRoot),
    )
    const rootOfRoots = newHashFromHex(String(issuerData.rootOfRoots))

    const state = hashElems([
      claimsTreeRoot.bigInt(),
      revocationTreeRoot.bigInt(),
      rootOfRoots.bigInt(),
    ])

    const issuerState: IssuerState = {
      claimsTreeRoot,
      revocationTreeRoot,
      rootOfRoots,
      state,
    }
    const decodedSignature = Hex.decodeString(credentialSigProof.signature)
    const signature = Signature.newFromCompressed(decodedSignature)

    const issuerAuthClaimIncProof = ensureArraySize(
      [...credentialSigProof.issuerData.mtp.siblings],
      40,
    )

    return {
      claimsTreeRoot,
      revocationTreeRoot,
      rootOfRoots,
      issuerState,

      signature: signature,

      issuerAuthClaim: unmarshalBinary(
        Hex.decodeString(credentialSigProof.issuerData.authCoreClaim),
      ),
      issuerAuthClaimIncProof,
    }
  }
}

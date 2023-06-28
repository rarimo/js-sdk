import { fetcher } from '@distributedlab/fetcher'
import { Hex, Signature } from '@iden3/js-crypto'
import {
  Claim,
  ClaimOptions,
  DID,
  fromBigEndian,
  fromLittleEndian,
  Id,
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
import type { BigNumber } from 'ethers'
import keccak256 from 'keccak256'

import { getGISTProof, readBytesFile, unmarshalBinary } from '@/helpers'
import type {
  ClaimStatus,
  IssuerState,
  QueryVariableNameAbstract,
  Schema,
  ZkpGenCreateOpts,
  ZkpGenQuery,
} from '@/types'

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
      'https://raw.githubusercontent.com/rarimo/js-sdk/feature/zk-proof-flow/packages/zkp-gen-iden3/assets/circuit.wasm',
    CIRCUIT_FINAL_KEY_URL:
      'https://raw.githubusercontent.com/rarimo/js-sdk/feature/zk-proof-flow/packages/zkp-gen-iden3/assets/circuit_final.zkey',
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
    const challenge = fromLittleEndian(Hex.decodeString(this.challenge))
    const signatureChallenge = this.identity.privateKey.signPoseidon(challenge)

    const gistInfo = await getGISTProof({
      rpcUrl: ZkpGen.config.RPC_URL,
      contractAddress: ZkpGen.config.STATE_V2_ADDRESS,
      userId: this.identity.identityIdBigIntString,
    })

    const claimStatus = await this.#requestClaimRevocationStatus(
      this.verifiableCredentials.body.credential.credentialStatus
        .revocationNonce,
    )

    const issuerID = DID.parse(this.verifiableCredentials.from).id
    const treeState = this.#calculateIssuerStateHash(claimStatus)
    const signatureProof = this.#parseBJJSignatureProof(issuerID, treeState)

    const { path, coreClaim, claimProof } = await this.#createCoreClaim()

    const timestamp = Math.floor(Date.now() / 1000)

    const value = new Array(64)
    value.fill('0')
    value[0] =
      this.verifiableCredentials.body.credential.credentialSubject?.[
        this.query.variableName
      ].toString()

    const inputs = JSON.stringify({
      requestID: this.requestId,
      userGenesisID: this.identity.identityIdBigIntString,
      profileNonce: '0',
      userState: this.identity.treeState.state,
      userClaimsTreeRoot: this.identity.treeState.claimsRoot,
      userRevTreeRoot: this.identity.treeState.revocationRoot,
      userRootsTreeRoot: this.identity.treeState.rootOfRoots,
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
      challenge: challenge.toString(),
      challengeSignatureR8x: signatureChallenge!.R8[0].toString(),
      challengeSignatureR8y: signatureChallenge!.R8[1].toString(),
      challengeSignatureS: signatureChallenge!.S.toString(),
      gistRoot: gistInfo?.root.toString(),
      gistMtp: gistInfo?.siblings.map((el: BigNumber) => el.toString()),
      gistMtpAuxHi: gistInfo?.auxIndex.toString(),
      gistMtpAuxHv: gistInfo?.auxValue.toString(),
      gistMtpNoAux: gistInfo?.auxExistence ? '0' : '1',
      claimSubjectProfileNonce: '0',
      issuerID: issuerID.bigInt().toString(),
      issuerAuthClaim: signatureProof.issuerAuthClaim,
      issuerAuthClaimMtp: signatureProof.siblings,
      issuerAuthClaimsTreeRoot: newHashFromHex(
        this.verifiableCredentials.body.credential.proof![0].issuerData.state
          .claimsTreeRoot,
      ).string(),
      issuerAuthRevTreeRoot: newHashFromHex(
        this.verifiableCredentials.body.credential.proof![0].issuerData.state
          .revocationTreeRoot,
      ).string(),
      issuerAuthRootsTreeRoot: newHashFromHex(
        this.verifiableCredentials.body.credential.proof![0].issuerData.state
          .rootOfRoots,
      ).string(),
      // TODO: issuer?
      //  temp solution
      issuerAuthClaimNonRevMtp: this.identity.authClaimNonRevProofSiblings.map(
        el => el.string(),
      ),
      issuerClaimNonRevMtpAuxHi: '0',
      issuerClaimNonRevMtpAuxHv: '0',
      issuerClaimNonRevMtpNoAux: '1',
      issuerClaim: [
        ...coreClaim.index.map(el => el.toBigInt().toString()),
        ...coreClaim.value.map(el => el.toBigInt().toString()),
      ],
      isRevocationChecked: '1',
      // TODO: temp solution
      issuerClaimNonRevMtp: this.identity.authClaimNonRevProofSiblings.map(el =>
        el.string(),
      ),
      issuerAuthClaimNonRevMtpAuxHi: '0',
      issuerAuthClaimNonRevMtpAuxHv: '0',
      issuerAuthClaimNonRevMtpNoAux: '1',
      issuerClaimNonRevClaimsTreeRoot: treeState.claimsTreeRoot.string(),
      issuerClaimNonRevRevTreeRoot: treeState.revocationTreeRoot.string(),
      issuerClaimNonRevRootsTreeRoot: treeState.rootOfRoots.string(),
      issuerClaimNonRevState: treeState.state.string(),
      issuerClaimSignatureR8x: signatureProof.signature.R8[0].toString(),
      issuerClaimSignatureR8y: signatureProof.signature.R8[1].toString(),
      issuerClaimSignatureS: signatureProof.signature.S.toString(),
      timestamp,
      claimSchema: coreClaim.getSchemaHash().bigInt().toString(),
      claimPathNotExists: '0',
      claimPathMtp: claimProof.proof.siblings.map(el => el.string()),
      claimPathMtpNoAux: '0',
      claimPathMtpAuxHi: '0',
      claimPathMtpAuxHv: '0',
      claimPathKey: (await path.mtEntry()).toString(),
      claimPathValue: claimProof.value?.value,
      operator: '1',
      slotIndex: '0',
      value: value,
    })

    // TODO: replace wrong wasm and zkey files
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

  async #createCoreClaim(): Promise<{
    path: Path
    coreClaim: Claim
    claimProof: {
      proof: Proof
      value?: MtValue
    }
  }> {
    const revNonce = new Uint8Array(8)

    window.crypto.getRandomValues(revNonce)

    const buf = new ArrayBuffer(32)
    const view = new DataView(buf)
    view.setUint32(
      0,
      this.verifiableCredentials.body.credential.credentialSubject?.[
        this.query.variableName
      ],
      true,
    )

    const schemaHash = await this.#getSchemaHash()
    const credential = { ...this.verifiableCredentials.body.credential }
    delete credential.proof

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
      ClaimOptions.withRevocationNonce(fromBigEndian(revNonce)),
      ClaimOptions.withVersion(0),
    )

    coreClaim.setRevocationNonce(
      BigInt(
        this.verifiableCredentials.body.credential.credentialStatus
          .revocationNonce,
      ),
    )

    return { path, coreClaim, claimProof }
  }

  async #getSchemaHash(): Promise<SchemaHash> {
    const { data } = await fetcher.get<Schema>(
      this.verifiableCredentials.body.credential.credentialSchema.id,
    )
    const schemaString =
      data?.$metadata.uris.jsonLdContext +
      '#' +
      this.verifiableCredentials.body.credential.credentialSubject.type
    const schemaBytes = new TextEncoder().encode(schemaString)
    const keccakString = keccak256(Buffer.from(schemaBytes))
    return new SchemaHash(keccakString.subarray(keccakString.byteLength - 16))
  }

  async #requestClaimRevocationStatus(revNonce: number) {
    const { data } = await fetcher.get(
      `${ZkpGen.config.ISSUER_API_URL}/integrations/qid-issuer/v1/public/claims/revocations/check/${revNonce}`,
    )

    return data as ClaimStatus
  }

  #calculateIssuerStateHash(claimStatus: ClaimStatus) {
    const state = newHashFromHex(String(claimStatus.issuer.state))
    const claims = newHashFromHex(String(claimStatus.issuer.claimsTreeRoot))
    const revocations = newHashFromHex(
      String(claimStatus.issuer.revocationTreeRoot),
    )
    const roots = newHashFromHex(String(claimStatus.issuer.rootOfRoots))

    return {
      state: state,
      claimsTreeRoot: claims,
      revocationTreeRoot: revocations,
      rootOfRoots: roots,
    }
  }

  #parseBJJSignatureProof(issuerID: Id, issuerState: IssuerState) {
    const proof = this.verifiableCredentials.body.credential.proof![0]
    const decodedSignature = Hex.decodeString(proof.signature)
    const signature = Signature.newFromCompressed(decodedSignature)
    const issuerAuthClaimStatus = {}

    const arr = new Array(40)
    arr.fill('0')

    proof.issuerData.mtp.siblings.forEach(
      (el: string, index: number) => (arr[index] = el),
    )

    return {
      issuerId: issuerID,
      issuerTreeState: issuerState,
      issuerAuthClaimMTP: proof.issuerData.mtp,
      signature: signature,
      issuerAuthClaim: unmarshalBinary(
        Hex.decodeString(proof.issuerData.authCoreClaim),
      ),
      issuerAuthNonRevProof: {
        treeState: issuerState,
        proof: issuerAuthClaimStatus,
      },
      siblings: arr,
    }
  }
}

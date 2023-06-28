import { Hex, PrivateKey } from '@iden3/js-crypto'
import {
  Claim,
  ClaimOptions,
  DID,
  fromBigEndian,
  Id,
  idenState,
  SchemaHash,
} from '@iden3/js-iden3-core'
import {
  circomSiblingsFromSiblings,
  hashElems,
  LocalStorageDB,
  Merkletree,
  type Siblings,
} from '@iden3/js-merkletree'

import { initPrivateKey } from '@/helpers'

export type TreeState = {
  state: string
  claimsRoot: string
  revocationRoot: string
  rootOfRoots: string
}

export type IdentityConfig = {
  AUTH_BJJ_CREDENTIAL_HASH: string
  ID_TYPE: Uint8Array
  CLAIM_PROOF_SIBLINGS_COUNT: number
}

export class Identity {
  privateKeyHex = '' as string
  identityId: Id = {} as Id
  claimProofSiblings: Siblings = [] as Siblings
  treeState: TreeState = {} as TreeState
  authClaim: Claim = {} as Claim

  public static config: IdentityConfig = {
    AUTH_BJJ_CREDENTIAL_HASH: '',
    ID_TYPE: Uint8Array.from([1, 0]),
    CLAIM_PROOF_SIBLINGS_COUNT: 40,
  }

  public static setConfig(config: Partial<IdentityConfig>) {
    this.config = Object.assign(this.config, config)
  }

  public static async create(privateKeyHex?: string) {
    const identity = new Identity(privateKeyHex)

    await identity.createIdentity()

    return identity
  }

  constructor(privateKeyHex?: string) {
    this.privateKeyHex = initPrivateKey(privateKeyHex)
  }

  public get privateKey() {
    return new PrivateKey(Hex.decodeString(this.privateKeyHex))
  }

  public get identityIdString() {
    return this.identityId.string()
  }

  public get identityIdBigIntString() {
    return this.identityId.bigInt().toString()
  }

  async createIdentity() {
    this.authClaim = this.createAuthClaim()

    const authResponse = this.authClaim.hiHv()

    const uint8array1 = new TextEncoder().encode('claims')
    const uint8array2 = new TextEncoder().encode('revocations')
    const uint8array3 = new TextEncoder().encode('roots')

    const storage1 = new LocalStorageDB(uint8array1)
    const storage2 = new LocalStorageDB(uint8array2)
    const storage3 = new LocalStorageDB(uint8array3)

    const claimsTree = new Merkletree(storage1, true, 32)
    const revocationsTree = new Merkletree(storage2, true, 32)
    const rootsTree = new Merkletree(storage3, true, 32)

    await claimsTree.add(authResponse.hi, authResponse.hv)

    const claimsTreeRoot = await claimsTree.root()
    const revocationsTreeRoot = await revocationsTree.root()
    const rootsTreeRoot = await rootsTree.root()

    const identity = idenState(
      claimsTreeRoot.bigInt(),
      revocationsTreeRoot.bigInt(),
      rootsTreeRoot.bigInt(),
    )

    this.identityId = DID.fromGenesisFromIdenState(
      Identity.config.ID_TYPE,
      identity,
    ).id

    const claimProof = await claimsTree.generateProof(
      this.authClaim.hIndex(),
      claimsTreeRoot,
    )

    const claimProofSiblings = circomSiblingsFromSiblings(
      claimProof.proof.siblings,
      Identity.config.CLAIM_PROOF_SIBLINGS_COUNT,
    )

    claimProof.proof.siblings = claimProofSiblings

    this.claimProofSiblings = claimProofSiblings

    const stateHash = hashElems([
      claimsTreeRoot.bigInt(),
      revocationsTreeRoot.bigInt(),
      rootsTreeRoot.bigInt(),
    ])

    this.treeState = {
      state: stateHash.string(),
      claimsRoot: claimsTreeRoot.string(),
      revocationRoot: revocationsTreeRoot.string(),
      rootOfRoots: rootsTreeRoot.string(),
    }
  }

  // TODO: move to zkp-auth package
  createAuthClaim() {
    const hash = SchemaHash.newSchemaHashFromHex(
      Identity.config.AUTH_BJJ_CREDENTIAL_HASH,
    )
    const revNonce = new Uint8Array(64)
    const key = this.privateKey.public()

    return Claim.newClaim(
      hash,
      ClaimOptions.withIndexDataInts(key.p[0], key.p[1]),
      ClaimOptions.withRevocationNonce(fromBigEndian(revNonce)),
    )
  }
}

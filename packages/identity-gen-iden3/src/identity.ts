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
  InMemoryDB,
  Merkletree,
  type Siblings,
} from '@iden3/js-merkletree'

import { getPrivateKeyHex } from '@/helpers'

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

let globalConfig: IdentityConfig = {
  AUTH_BJJ_CREDENTIAL_HASH: '',
  ID_TYPE: Uint8Array.from([1, 0]),
  CLAIM_PROOF_SIBLINGS_COUNT: 40,
}

export class Identity {
  public privateKeyHex = '' as string
  public id: Id = {} as Id
  public authClaimIncProofSiblings: Siblings = [] as Siblings
  public authClaimNonRevProofSiblings: Siblings = [] as Siblings
  public treeState: TreeState = {} as TreeState
  public coreAuthClaim: Claim = {} as Claim

  public static get config(): IdentityConfig {
    return globalConfig
  }

  public static setConfig(config: Partial<IdentityConfig>) {
    globalConfig = { ...globalConfig, ...config }
  }

  public static async create(privateKeyHex?: string): Promise<Identity> {
    const identity = new Identity(privateKeyHex)

    await identity.createIdentity()

    return identity
  }

  constructor(privateKeyHex?: string) {
    this.privateKeyHex = getPrivateKeyHex(privateKeyHex)
  }

  public get privateKey() {
    return new PrivateKey(Hex.decodeString(this.privateKeyHex))
  }

  public get idString() {
    return this.id.string()
  }

  public get idBigIntString() {
    return this.id.bigInt().toString()
  }

  public get authClaimInput() {
    return [
      ...this.coreAuthClaim.index.map(el => el.toBigInt().toString()),
      ...this.coreAuthClaim.value.map(el => el.toBigInt().toString()),
    ]
  }

  async createIdentity() {
    this.coreAuthClaim = this.createCoreAuthClaim()

    const authResponse = this.coreAuthClaim.hiHv()

    const uint8array1 = new TextEncoder().encode('claims')
    const uint8array2 = new TextEncoder().encode('revocations')
    const uint8array3 = new TextEncoder().encode('roots')

    const storage1 = new InMemoryDB(uint8array1)
    const storage2 = new InMemoryDB(uint8array2)
    const storage3 = new InMemoryDB(uint8array3)

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

    this.id = DID.fromGenesisFromIdenState(Identity.config.ID_TYPE, identity).id

    const authClaimIncProof = await claimsTree.generateProof(
      this.coreAuthClaim.hIndex(),
      claimsTreeRoot,
    )

    const authClaimIncProofSiblings = circomSiblingsFromSiblings(
      authClaimIncProof.proof.siblings,
      Identity.config.CLAIM_PROOF_SIBLINGS_COUNT,
    )

    const authClaimNonRevProof = await revocationsTree.generateProof(
      this.coreAuthClaim.getRevocationNonce(),
      revocationsTreeRoot,
    )

    const authClaimNonRevProofSiblings = circomSiblingsFromSiblings(
      authClaimNonRevProof.proof.siblings,
      Identity.config.CLAIM_PROOF_SIBLINGS_COUNT,
    )

    this.authClaimIncProofSiblings = authClaimIncProofSiblings
    this.authClaimNonRevProofSiblings = authClaimNonRevProofSiblings

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

    return this
  }

  createCoreAuthClaim(): Claim {
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

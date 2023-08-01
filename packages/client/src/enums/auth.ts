export enum AccountType {
  BaseAccount = '/cosmos.auth.v1beta1.BaseAccount',
  ModuleAccount = '/cosmos.auth.v1beta1.ModuleAccount',
  EthAccount = '/ethermint.types.v1.EthAccount',
}

export enum PublicKeyType {
  Secp256k1 = '/cosmos.crypto.secp256k1.PubKey',
  Ed25519 = '/cosmos.crypto.ed25519.PubKey',
}

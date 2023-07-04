import { Hex, PrivateKey } from '@iden3/js-crypto'

const generatePrivateKey = (): PrivateKey => {
  const randomValues = new Uint8Array(32)

  if (!(typeof window === 'undefined')) {
    return new PrivateKey(window.crypto.getRandomValues(randomValues))
  }

  const webcrypto = require('crypto').webcrypto

  return new PrivateKey(webcrypto.getRandomValues(randomValues))
}

export const getPrivateKeyHex = (hexString?: string): string => {
  if (hexString) {
    return new PrivateKey(Hex.decodeString(hexString)).hex()
  }

  const privateKey = generatePrivateKey()
  return privateKey.hex()
}

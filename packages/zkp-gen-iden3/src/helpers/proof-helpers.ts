import { newHashFromHex, Proof, ZERO_HASH } from '@iden3/js-merkletree'

import type { ClaimStatusMtp } from '@/types'

export const ensureArraySize = (arr: string[], size: number): string[] => {
  if (arr.length < size) {
    const newArr = new Array(size - arr.length).fill('0')
    return arr.concat(newArr)
  }
  return arr
}

export const getNodeAuxValue = (p: Proof | ClaimStatusMtp | undefined) => {
  // proof of inclusion
  if (p?.existence) {
    return {
      key: ZERO_HASH,
      value: ZERO_HASH,
      noAux: '0',
    }
  }

  // proof of non-inclusion (NodeAux exists)
  if (p?.nodeAux?.value !== undefined && p?.nodeAux?.key !== undefined) {
    return {
      key:
        typeof p.nodeAux.key === 'string'
          ? newHashFromHex(p.nodeAux.key)
          : p.nodeAux.key,
      value:
        typeof p.nodeAux.value === 'string'
          ? newHashFromHex(p.nodeAux.value)
          : p.nodeAux.value,
      noAux: '0',
    }
  }

  // proof of non-inclusion (NodeAux does not exist)
  return {
    key: ZERO_HASH,
    value: ZERO_HASH,
    noAux: '1',
  }
}

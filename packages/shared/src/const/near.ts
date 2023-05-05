import { ChainNames } from '@/enums'
import type { ChainIdMap } from '@/types'

export const NEAR_CHAIN_IDS: ChainIdMap = {
  [ChainNames.NearMainNet]: 'mainnet',
  [ChainNames.NearTestNet]: 'testnet',
}

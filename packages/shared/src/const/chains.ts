import { ChainTypes } from '@/enums'

import { EVM_CHAIN_IDS } from './evm'
import { NEAR_CHAIN_IDS } from './near'
import { SOLANA_CHAIN_IDS } from './solana'

export const CHAIN_IDS = {
  [ChainTypes.EVM]: EVM_CHAIN_IDS,
  [ChainTypes.Solana]: SOLANA_CHAIN_IDS,
  [ChainTypes.Near]: NEAR_CHAIN_IDS,
}

import { NEAR_CHAIN_IDS } from '@/const/near'
import { ChainTypes } from '@/enums'
import type { BridgeChain } from '@/types'

import { EVM_CHAIN_IDS, EVM_CHAINS } from './evm'
import { SOLANA_CHAIN_IDS } from './solana'

export const CHAINS: Readonly<{ [key in ChainTypes]?: BridgeChain[] }> = {
  [ChainTypes.EVM]: EVM_CHAINS,
}

export const CHAIN_IDS = {
  [ChainTypes.EVM]: EVM_CHAIN_IDS,
  [ChainTypes.Solana]: SOLANA_CHAIN_IDS,
  [ChainTypes.Near]: NEAR_CHAIN_IDS,
}

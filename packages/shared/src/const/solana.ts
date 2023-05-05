import { ChainNames } from '@/enums'
import type { ChainIdMap } from '@/types'

export const SOLANA_CHAIN_IDS: ChainIdMap = {
  [ChainNames.SolanaMainNet]: 'mainnet',
  [ChainNames.SolanaDevNet]: 'devnet',
  [ChainNames.SolanaTestNet]: 'testnet',
}

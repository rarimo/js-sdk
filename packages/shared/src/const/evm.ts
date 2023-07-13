import { ChainNames } from '@/enums'
import type { ChainIdMap } from '@/types'

export const EVM_CHAIN_IDS: ChainIdMap = {
  [ChainNames.Ethereum]: 1,
  [ChainNames.Polygon]: 137,
  [ChainNames.Fuji]: 43113,
  [ChainNames.Avalanche]: 43114,
  [ChainNames.Goerli]: 5,
  [ChainNames.BinanceSmartChain]: 56,
  [ChainNames.Chapel]: 97,
}

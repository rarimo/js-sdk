import { CHAIN_NAME } from '@/const'
import { TChainName } from '@/types'

export const WRAPPED_TOKEN_SYMBOL: Partial<Record<TChainName, string>> = {
  [CHAIN_NAME.ethereum]: 'WETH',
  [CHAIN_NAME.polygon]: 'WMATIC',
  [CHAIN_NAME.avalanche]: 'WAVAX',
  [CHAIN_NAME.goerli]: 'WETH',
  [CHAIN_NAME.fuji]: 'WAVAX',
} as const

export const AVALANCHE_WRAPPED_ETHER_SYMBOL = 'WETH.e'

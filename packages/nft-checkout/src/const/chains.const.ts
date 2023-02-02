import {
  MAINNET_CHAIN_IDS,
  MAINNET_CHAIN_NAME,
  TESTNET_CHAIN_IDS,
  TESTNET_CHAIN_NAME,
} from '@/enums'
import { TChainIds, TChainName } from '@/types'

export const CHAIN_NAME = {
  ...MAINNET_CHAIN_NAME,
  ...TESTNET_CHAIN_NAME,
} as const

export const CHAIN_IDS = {
  ...MAINNET_CHAIN_IDS,
  ...TESTNET_CHAIN_IDS,
} as const

export const CHAIN_NAMES_TO_IDS: Partial<Record<TChainName, TChainIds>> = {
  [CHAIN_NAME.ethereum]: CHAIN_IDS.ethereum,
  [CHAIN_NAME.goerli]: CHAIN_IDS.goerli,

  [CHAIN_NAME.polygon]: CHAIN_IDS.polygon,
  [CHAIN_NAME.mumbai]: CHAIN_IDS.mumbai,

  [CHAIN_NAME.avalanche]: CHAIN_IDS.avalanche,
  [CHAIN_NAME.fuji]: CHAIN_IDS.fuji,
} as const

export const CHAIN_IDS_TO_NAMES: Record<TChainIds, TChainName> = {
  [CHAIN_IDS.ethereum]: CHAIN_NAME.ethereum,
  [CHAIN_IDS.goerli]: CHAIN_NAME.goerli,

  [CHAIN_IDS.polygon]: CHAIN_NAME.polygon,
  [CHAIN_IDS.mumbai]: CHAIN_NAME.mumbai,

  [CHAIN_IDS.avalanche]: CHAIN_NAME.avalanche,
  [CHAIN_IDS.fuji]: CHAIN_NAME.fuji,
} as const

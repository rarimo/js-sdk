import { EVMSwapContractVersion } from '@rarimo/shared'

import { SWAP_TRADER_JOE_V2_ABI } from './swap-trader-joe-v2'
import { SWAP_V2_ABI } from './swap-v2'
import { SWAP_V3_ABI } from './swap-v3'

export * from './erc-20'
export * from './swap-v2'
export * from './swap-v3'

export const SWAP_CONTRACT_ABIS = {
  [EVMSwapContractVersion.TraderJoe]: SWAP_TRADER_JOE_V2_ABI,
  [EVMSwapContractVersion.PancakeSwap]: SWAP_V2_ABI,
  [EVMSwapContractVersion.QuickSwap]: SWAP_V2_ABI,
  [EVMSwapContractVersion.UniswapV3]: SWAP_V3_ABI,
}

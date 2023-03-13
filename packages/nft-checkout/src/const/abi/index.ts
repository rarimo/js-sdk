import { SwapContractVersion } from '@/enums'

import { SWAP_TRADER_JOE_V2_ABI } from './swap-trader-joe-v2'
import { SWAP_V2_ABI } from './swap-v2'
import { SWAP_V3_ABI } from './swap-v3'

export * from './erc-20'
export * from './swap-v2'
export * from './swap-v3'

export const SWAP_CONTRACT_ABIS = {
  [SwapContractVersion.TraderJoe]: SWAP_TRADER_JOE_V2_ABI,
  [SwapContractVersion.PancakeSwap]: SWAP_V2_ABI,
  [SwapContractVersion.QuickSwap]: SWAP_V2_ABI,
  [SwapContractVersion.UniswapV3]: SWAP_V3_ABI,
}

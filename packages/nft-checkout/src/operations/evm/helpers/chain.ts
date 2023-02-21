import { SwapContractVersion } from '@/enums'
import { BridgeChain } from '@/types'

export const isTraderJoe = (chain: BridgeChain): boolean => {
  return chain.contactVersion === SwapContractVersion.TraderJoe
}

export const isPancakeSwap = (chain: BridgeChain): boolean => {
  return chain.contactVersion === SwapContractVersion.PancakeSwap
}

import { SwapContractVersion } from '@/enums'
import { BridgeChain } from '@/types'

export const isV2 = (chain: BridgeChain): boolean => {
  return chain.contactVersion === SwapContractVersion.V2
}

import { CHAIN_NAME } from '@/const'
import { TChainName } from '@/types'
import { AVALANCHE_WRAPPED_ETHER_SYMBOL, WRAPPED_TOKEN_SYMBOL } from '@/const'

export const getRarimoSupportedToken = (
  nftChainName: TChainName,
  paymentChainName?: TChainName,
) => {
  // For avalance Wrapped ether symbol is WETH.e. WETH is a symbol for Wormhole ether which has low liquidity
  if (
    nftChainName === CHAIN_NAME.ethereum &&
    paymentChainName === CHAIN_NAME.avalanche
  )
    return AVALANCHE_WRAPPED_ETHER_SYMBOL

  return WRAPPED_TOKEN_SYMBOL[nftChainName]
}

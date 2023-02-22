import { ChainNames, SwapContractVersion } from '@/enums'
import { BridgeChain } from '@/types'
import { CHAIN_IDS } from '@/const'
import { ChainTypes } from '@rarimo/provider'

export const isV2 = (chain: BridgeChain): boolean => {
  return chain.contactVersion === SwapContractVersion.AvalancheV2
}

const chains = CHAIN_IDS[ChainTypes.EVM]

export const TARGET_TOKEN_SYMBOLS = {
  [chains[ChainNames.Ethereum]]: 'WETH',
  [chains[ChainNames.Polygon]]: 'WMATIC',
  [chains[ChainNames.Avalanche]]: 'WAVAX',
  [chains[ChainNames.Goerli]]: 'WETH',
  [chains[ChainNames.Sepolia]]: 'WETH',
  [chains[ChainNames.Fuji]]: 'WAVAX',
}

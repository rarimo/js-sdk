import { ChainTypes } from '@rarimo/provider'

import { CHAIN_IDS } from '@/const'
import { ChainNames } from '@/enums'

const chains = CHAIN_IDS[ChainTypes.EVM]

export const TARGET_TOKEN_SYMBOLS = {
  // Ethereum
  [chains[ChainNames.Ethereum]]: 'WETH',
  [chains[ChainNames.Goerli]]: 'WETH',
  [chains[ChainNames.Sepolia]]: 'WETH',

  // Polygon
  [chains[ChainNames.Polygon]]: 'WMATIC',
  [chains[ChainNames.Mumbai]]: 'WMATIC',

  // Avalanche
  [chains[ChainNames.Avalanche]]: 'WAVAX',
  [chains[ChainNames.Fuji]]: 'WAVAX',

  // BSC
  [chains[ChainNames.BinanceSmartChain]]: 'WBNB',
  [chains[ChainNames.Chapel]]: 'WBNB',
}

import { CHAIN_IDS, ChainNames } from '@rarimo/core'
import { ChainTypes } from '@rarimo/provider'

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

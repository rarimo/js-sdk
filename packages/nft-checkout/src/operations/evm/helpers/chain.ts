import { CHAIN_IDS, ChainId, ChainNames, ChainTypes } from '@rarimo/shared'

const chains = CHAIN_IDS[ChainTypes.EVM]

const mustGetChainId = (name: ChainNames): ChainId => {
  const chainId = chains[name]
  if (!chainId) {
    throw new Error(`Chain ${name} not found`)
  }

  return chainId
}

// TODO: remove
export const TARGET_TOKEN_SYMBOLS = {
  // Ethereum
  [mustGetChainId(ChainNames.Ethereum)]: 'WETH',
  [mustGetChainId(ChainNames.Goerli)]: 'WETH',
  [mustGetChainId(ChainNames.Sepolia)]: 'WETH',

  // Polygon
  [mustGetChainId(ChainNames.Polygon)]: 'WMATIC',
  [mustGetChainId(ChainNames.Mumbai)]: 'WMATIC',

  // Avalanche
  [mustGetChainId(ChainNames.Avalanche)]: 'WAVAX',
  [mustGetChainId(ChainNames.Fuji)]: 'WAVAX',

  // BSC
  [mustGetChainId(ChainNames.BinanceSmartChain)]: 'WBNB',
  [mustGetChainId(ChainNames.Chapel)]: 'WBNB',
}

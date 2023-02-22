import { ChainNames, SwapContractVersion } from '../../../enums'
import { BridgeChain } from '../../../types'
import { CHAIN_IDS } from '../../../const'
import { ChainTypes } from '@rarimo/provider'

export const isTraderJoe = (chain: BridgeChain): boolean => {
  return chain.contactVersion === SwapContractVersion.TraderJoe
}

export const isPancakeSwap = (chain: BridgeChain): boolean => {
  return chain.contactVersion === SwapContractVersion.PancakeSwap
}

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
  [chains[ChainNames.BSC]]: 'WBNB',
  [chains[ChainNames.BSCTestnet]]: 'WBNB',
}

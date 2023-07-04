import type { HexString } from '@rarimo/shared'
import { ChainNames } from '@rarimo/shared'

export const USDC_MAP: { [key in ChainNames]?: HexString } = {
  [ChainNames.Ethereum]: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  [ChainNames.Polygon]: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
  [ChainNames.Avalanche]: '0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664',
  [ChainNames.Goerli]: '0x07865c6E87B9F70255377e024ace6630C1Eaa37F',
  [ChainNames.Mumbai]: '0x0fa8781a83e46826621b3bc094ea2a0212e71b23',
  [ChainNames.Fuji]: '0x5425890298aed601595a70ab815c96711a31bc65',
  [ChainNames.BinanceSmartChain]: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
}

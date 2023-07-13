import type { HexString } from '@rarimo/shared'
import { ChainNames } from '@rarimo/shared'

export const USDC_MAP: { [key in ChainNames]?: HexString } = {
  [ChainNames.Ethereum]: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  [ChainNames.BinanceSmartChain]: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
  [ChainNames.Avalanche]: '0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664',
  [ChainNames.Polygon]: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
  [ChainNames.Goerli]: '0x07865c6E87B9F70255377e024ace6630C1Eaa37F',
  [ChainNames.Fuji]: '0xB6076C93701D6a07266c31066B298AeC6dd65c2d',
  [ChainNames.Chapel]: '0x29a751263Aa7fD3E7728F2A2c9136007A2d61Ac1',
}

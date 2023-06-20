import { Token as QSToken } from '@rarimo/quickswap-sdk'
import { Token as TJToken } from '@traderjoe-xyz/sdk'

import { EVM_CHAIN_IDS } from '@/const/evm'
import { ChainNames } from '@/enums'

export const WAVAX_Avalanche = new TJToken(
  Number(EVM_CHAIN_IDS[ChainNames.Avalanche]),
  '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',
  18,
  'WAVAX',
  'Wrapped AVAX',
)
export const USDC_Avalanche = new TJToken(
  Number(EVM_CHAIN_IDS[ChainNames.Avalanche]),
  '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
  6,
  'USDC',
  'USD Coin',
)
export const USDT_Avalanche = new TJToken(
  Number(EVM_CHAIN_IDS[ChainNames.Avalanche]),
  '0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7',
  6,
  'USDT',
  'Tether Token',
)

export const JOE_Avalanche = new TJToken(
  Number(EVM_CHAIN_IDS[ChainNames.Avalanche]),
  '0x6e84a6216eA6dACC71eE8E6b0a5B7322EEbC0fDd',
  18,
  'JOE',
  'TraderJoe Token',
)
export const WETH_Avalanche = new TJToken(
  Number(EVM_CHAIN_IDS[ChainNames.Avalanche]),
  '0x8b82A291F83ca07Af22120ABa21632088fC92931',
  18,
  'WETH',
  'Wrapped Ether (Wormhole)',
)

export const WMATIC_Polygon = new QSToken(
  Number(EVM_CHAIN_IDS[ChainNames.Polygon]),
  '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
  18,
  'WMATIC',
  'Wrapped Matic',
)
export const USDC_Polygon = new QSToken(
  Number(EVM_CHAIN_IDS[ChainNames.Polygon]),
  '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
  6,
  'USDC',
  'USD Coin',
)
export const USDT_Polygon = new QSToken(
  Number(EVM_CHAIN_IDS[ChainNames.Polygon]),
  '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
  6,
  'USDT',
  'Tether USD',
)
export const WBTC_Polygon = new QSToken(
  Number(EVM_CHAIN_IDS[ChainNames.Polygon]),
  '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6',
  8,
  'WBTC',
  'Wrapped BTC',
)
export const WETH_Polygon = new QSToken(
  Number(EVM_CHAIN_IDS[ChainNames.Polygon]),
  '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
  18,
  'WETH',
  'Wrapped Ether',
)
export const DAI_Polygon = new QSToken(
  Number(EVM_CHAIN_IDS[ChainNames.Polygon]),
  '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
  18,
  'DAI',
  'Dai Stablecoin',
)
export const QUICK_Polygon = new QSToken(
  Number(EVM_CHAIN_IDS[ChainNames.Polygon]),
  '0xB5C064F955D8e7F38fE0460C556a72987494eE17',
  18,
  'QUICK(NEW)',
  'QuickSwap(NEW)',
)
export const BASE_AVALANCHE_TOKENS = [
  USDC_Avalanche,
  USDT_Avalanche,
  JOE_Avalanche,
  WAVAX_Avalanche,
  WETH_Avalanche,
]
export const BASE_POLYGON_TOKENS = [
  QUICK_Polygon,
  WBTC_Polygon,
  DAI_Polygon,
  WETH_Polygon,
  WMATIC_Polygon,
  USDC_Polygon,
  USDT_Polygon,
]

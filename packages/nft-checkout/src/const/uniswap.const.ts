import { Percent } from '@uniswap/sdk-core'
import JSBI from 'jsbi'

// one basis JSBI.BigInt
const BIPS_BASE = JSBI.BigInt(10000)
export const ONE_BIPS = new Percent(JSBI.BigInt(1), BIPS_BASE)

// used for warning states
export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(
  JSBI.BigInt(100),
  BIPS_BASE,
) // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(
  JSBI.BigInt(300),
  BIPS_BASE,
) // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(
  JSBI.BigInt(500),
  BIPS_BASE,
) // 5%
// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(
  JSBI.BigInt(1000),
  BIPS_BASE,
) // 10%
// for non expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(
  JSBI.BigInt(1500),
  BIPS_BASE,
) // 15%

export const ZERO_PERCENT = new Percent('0')
export const ONE_HUNDRED_PERCENT = new Percent('1')
export const DEFAULT_LOCALE = 'en-US'

export const CHAINS = {
  ETHEREUM: {
    name: 'ethereum',
    chainId: 1,
  },
  POLYGON: {
    name: 'polygon',
    chainId: 137,
  },
}

export const V3_SWAP_DEFAULT_SLIPPAGE = new Percent(250, 10_000) // .50%

export const DEMO_TOKENS = [
  {
    chainId: 5,
    address: '0xdc31ee1784292379fbb2964b3b9c4124d8f89c60',
    name: 'Dai',
    symbol: 'DAI',
    decimals: 18,
    logoURI:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
  },
  {
    chainId: 5,
    address: '0xaf7f7d3bc41dc0ab220de52b91ebeb5d48e9f4c7',
    name: 'USDC',
    symbol: 'USDC',
    decimals: 6,
    logoURI:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
  },
  {
    chainId: 5,
    address: '0x326c977e6efc84e512bb9c30f76e30c160ed06fb',
    name: 'ChainLink Token',
    symbol: 'LINK',
    decimals: 18,
    logoURI:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x514910771AF9Ca656af840dff83E8264EcF986CA/logo.png',
  },
  {
    name: 'Uniswap',
    address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
    symbol: 'UNI',
    decimals: 18,
    chainId: 5,
    logoURI: 'ipfs://QmXttGpZrECX5qCyXbBQiqgQNytVGeZW5Anewvh2jc4psg',
  },
  {
    name: 'Wrapped Ether',
    address: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
    symbol: 'WETH',
    decimals: 18,
    chainId: 5,
    logoURI:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6/logo.png',
  },
]

import { Token } from '@/entities'
import { ChainNames } from '@/enums'

import { EVM_CHAINS } from './chains'

const chapelChain = EVM_CHAINS.find(i => i.name === ChainNames.Chapel)!
const fujiChain = EVM_CHAINS.find(i => i.name === ChainNames.Fuji)!
const ethChain = EVM_CHAINS.find(i => i.name === ChainNames.Ethereum)!
const bscChain = EVM_CHAINS.find(i => i.name === ChainNames.BinanceSmartChain)!

export const ETH_TOKEN_LIST: Token[] = [
  new Token({
    chain: ethChain,
    address: '0xb8c77482e45f1f44de1745f52c74426c631bdd52',
    name: 'Binance Coin',
    symbol: 'BNB',
    decimals: 18,
    logoURI:
      'https://raw.githubusercontent.com/rarimo/js-sdk/main/assets/logos/bnb-logo.png',
  }),
]

export const BINANCE_TOKEN_LIST: Token[] = [
  new Token({
    chain: bscChain,
    address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
    name: 'USD Coin',
    symbol: 'USDC',
    decimals: 18,
    logoURI:
      'https://raw.githubusercontent.com/rarimo/js-sdk/main/assets/logos/usdc-logo.png',
  }),
  new Token({
    chain: bscChain,
    address: '0x1CE0c2827e2eF14D5C4f29a091d735A204794041',
    name: 'Avalanche Coin',
    symbol: 'AVAX',
    decimals: 18,
    logoURI:
      'https://raw.githubusercontent.com/rarimo/js-sdk/main/assets/logos/avax-logo.png',
  }),
]

export const PANCAKE_SWAP_TESTNET_TOKEN_LIST: Token[] = [
  new Token({
    chain: chapelChain,
    address: '0x8BaBbB98678facC7342735486C851ABD7A0d17Ca',
    name: 'Ethereum Token',
    symbol: 'ETH',
    decimals: 18,
    logoURI:
      'https://raw.githubusercontent.com/rarimo/js-sdk/main/assets/logos/eth-logo.png',
  }),
  new Token({
    chain: chapelChain,
    address: '0xae13d989dac2f0debff460ac112a837c89baa7cd',
    name: 'Wrapped Binance Testnet Token',
    symbol: 'WBNB',
    decimals: 18,
    logoURI:
      'https://raw.githubusercontent.com/rarimo/js-sdk/main/assets/logos/bnb-logo.png',
  }),
  new Token({
    chain: chapelChain,
    address: '0x64544969ed7EBf5f083679233325356EbE738930',
    name: 'USDCoin',
    symbol: 'USDC',
    decimals: 18,
    logoURI:
      'https://raw.githubusercontent.com/rarimo/js-sdk/main/assets/logos/usdc-logo.png',
  }),
  new Token({
    chain: chapelChain,
    address: '0x337610d27c682E347C9cD60BD4b3b107C9d34dDd',
    name: 'Tether USD',
    symbol: 'USDT',
    decimals: 18,
    logoURI:
      'https://raw.githubusercontent.com/rarimo/js-sdk/main/assets/logos/usdt-logo.png',
  }),
]

export const TRADER_JOE_SWAP_TESTNET_TOKEN_LIST: Token[] = [
  new Token({
    chain: fujiChain,
    address: '0xd00ae08403B9bbb9124bB305C09058E32C39A48c',
    decimals: 18,
    name: 'Wrapped AVAX',
    symbol: 'WAVAX',
    logoURI:
      'https://raw.githubusercontent.com/rarimo/js-sdk/main/assets/logos/wavax-logo.png',
  }),
  new Token({
    chain: fujiChain,
    address: '0xB6076C93701D6a07266c31066B298AeC6dd65c2d',
    decimals: 6,
    name: 'USD Coin',
    symbol: 'USDC',
    logoURI:
      'https://raw.githubusercontent.com/rarimo/js-sdk/main/assets/logos/usdc-logo.png',
  }),
]

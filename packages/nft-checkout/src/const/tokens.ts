import { ChainNames, EVM_CHAINS } from '@rarimo/shared'

import { Token } from '@/entities'

const chapelChain = EVM_CHAINS.find(i => i.name === ChainNames.Chapel)!
const fujiChain = EVM_CHAINS.find(i => i.name === ChainNames.Fuji)!

export const PANCAKE_SWAP_TESTNET_TOKEN_LIST: Token[] = [
  new Token({
    chain: chapelChain,
    address: '0x8BaBbB98678facC7342735486C851ABD7A0d17Ca',
    name: 'Ethereum Token',
    symbol: 'ETH',
    decimals: 18,
    logoURI:
      'https://raw.githubusercontent.com/MetaMask/metamask-extension/develop/app/images/eth_logo.svg',
  }),
  new Token({
    chain: chapelChain,
    address: '0xae13d989dac2f0debff460ac112a837c89baa7cd',
    name: 'Wrapped Binance Testnet Token',
    symbol: 'WBNB',
    decimals: 18,
    logoURI:
      'https://raw.githubusercontent.com/MetaMask/metamask-extension/develop/app/images/bnb.png',
  }),
  new Token({
    chain: chapelChain,
    address: '0x64544969ed7EBf5f083679233325356EbE738930',
    name: 'USDCoin',
    symbol: 'USDC',
    decimals: 18,
    logoURI:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
  }),
  new Token({
    chain: chapelChain,
    address: '0x337610d27c682E347C9cD60BD4b3b107C9d34dDd',
    name: 'Tether USD',
    symbol: 'USDT',
    decimals: 18,
    logoURI:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
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
      'https://raw.githubusercontent.com/traderjoe-xyz/joe-tokenlists/main/logos/0xd00ae08403B9bbb9124bB305C09058E32C39A48c/logo.png',
  }),
  new Token({
    chain: fujiChain,
    address: '0xB6076C93701D6a07266c31066B298AeC6dd65c2d',
    decimals: 6,
    name: 'USD Coin',
    symbol: 'USDC',
    logoURI:
      'https://raw.githubusercontent.com/traderjoe-xyz/joe-tokenlists/main/logos/0xB6076C93701D6a07266c31066B298AeC6dd65c2d/logo.png',
  }),
]

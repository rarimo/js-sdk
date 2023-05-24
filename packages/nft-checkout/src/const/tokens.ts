import { newToken, Token } from '@rarimo/bridge'
import { ChainNames, EVM_CHAINS } from '@rarimo/shared'

const chapelChain = EVM_CHAINS.find(i => i.name === ChainNames.Chapel)!
const fujiChain = EVM_CHAINS.find(i => i.name === ChainNames.Fuji)!
const ethChain = EVM_CHAINS.find(i => i.name === ChainNames.Ethereum)!
const bscChain = EVM_CHAINS.find(i => i.name === ChainNames.BinanceSmartChain)!

export const ETH_TOKEN_LIST: Token[] = [
  newToken(
    ethChain,
    '0xb8c77482e45f1f44de1745f52c74426c631bdd52',
    'Binance Coin',
    'BNB',
    18,
    'https://raw.githubusercontent.com/rarimo/js-sdk/main/assets/logos/bnb-logo.png',
  ),
]

export const BINANCE_TOKEN_LIST: Token[] = [
  newToken(
    bscChain,
    '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
    'USD Coin',
    'USDC',
    18,
    'https://raw.githubusercontent.com/rarimo/js-sdk/main/assets/logos/usdc-logo.png',
  ),
  newToken(
    bscChain,
    '0x1CE0c2827e2eF14D5C4f29a091d735A204794041',
    'Avalanche Coin',
    'AVAX',
    18,
    'https://raw.githubusercontent.com/rarimo/js-sdk/main/assets/logos/avax-logo.png',
  ),
]

export const PANCAKE_SWAP_TESTNET_TOKEN_LIST: Token[] = [
  newToken(
    chapelChain,
    '0x8BaBbB98678facC7342735486C851ABD7A0d17Ca',
    'Ethereum Token',
    'ETH',
    18,
    'https://raw.githubusercontent.com/rarimo/js-sdk/main/assets/logos/eth-logo.png',
  ),
  newToken(
    chapelChain,
    '0xae13d989dac2f0debff460ac112a837c89baa7cd',
    'Wrapped Binance Testnet Token',
    'WBNB',
    18,
    'https://raw.githubusercontent.com/rarimo/js-sdk/main/assets/logos/bnb-logo.png',
  ),
  newToken(
    chapelChain,
    '0x64544969ed7EBf5f083679233325356EbE738930',
    'USDCoin',
    'USDC',
    18,
    'https://raw.githubusercontent.com/rarimo/js-sdk/main/assets/logos/usdc-logo.png',
  ),
  newToken(
    chapelChain,
    '0x337610d27c682E347C9cD60BD4b3b107C9d34dDd',
    'Tether USD',
    'USDT',
    18,
    'https://raw.githubusercontent.com/rarimo/js-sdk/main/assets/logos/usdt-logo.png',
  ),
]

export const TRADER_JOE_SWAP_TESTNET_TOKEN_LIST: Token[] = [
  newToken(
    fujiChain,
    '0xd00ae08403B9bbb9124bB305C09058E32C39A48c',
    'Wrapped AVAX',
    'WAVAX',
    18,
    'https://raw.githubusercontent.com/rarimo/js-sdk/main/assets/logos/wavax-logo.png',
  ),
  newToken(
    fujiChain,
    '0xB6076C93701D6a07266c31066B298AeC6dd65c2d',
    'USD Coin',
    'USDC',
    6,
    'https://raw.githubusercontent.com/rarimo/js-sdk/main/assets/logos/usdc-logo.png',
  ),
]

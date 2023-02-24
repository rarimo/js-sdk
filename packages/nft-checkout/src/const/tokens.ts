import { Token } from '../types'
import { ChainNames } from '../enums'
import { EVM_CHAINS } from './chains'

const chapelChain = EVM_CHAINS.find(i => i.name === ChainNames.Chapel)!

export const PANCAKE_SWAP_TESTNET_TOKEN_LIST: Token[] = [
  {
    chain: chapelChain,
    address: '',
    name: 'Binance Testnet Token',
    symbol: 'tBNB',
    decimals: 18,
  },
  {
    chain: chapelChain,
    address: '0x8BaBbB98678facC7342735486C851ABD7A0d17Ca',
    name: 'Ethereum Token',
    symbol: 'ETH',
    decimals: 18,
  },
  {
    chain: chapelChain,
    address: '0xae13d989dac2f0debff460ac112a837c89baa7cd',
    name: 'Wrapped Binance Testnet Token',
    symbol: 'WBNB',
    decimals: 18,
  },
]

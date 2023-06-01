import type { FetcherConfig } from '@distributedlab/fetcher'

import type { Config } from './types'

export const DEFAULT_CONFIG: Config = {
  UNISWAP_V3_TOKEN_LIST_URL:
    'https://ipfs.testnet.rarimo.com/ipfs/ipns/tokens.uniswap.org',
  TRADER_JOE_TOKEN_LIST_URL:
    'https://raw.githubusercontent.com/traderjoe-xyz/joe-tokenlists/main/mc.tokenlist.json',
  PANCAKE_SWAP_TOKEN_LIST_URL:
    'https://tokens.pancakeswap.finance/pancakeswap-extended.json',
  QUICK_SWAP_TOKEN_LIST_URL:
    'https://unpkg.com/quickswap-default-token-list/build/quickswap-default.tokenlist.json',
}

export const DEFAULT_FETCHER_CONFIG: FetcherConfig = {
  baseUrl: 'https://foo.bar',
  credentials: 'omit',
  referrerPolicy: 'no-referrer',
}

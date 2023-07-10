import { Fetcher } from '@distributedlab/fetcher'

export const checkoutApi = new Fetcher({
  baseUrl: 'https://api.testnet.rarimo.com/checkout',
})

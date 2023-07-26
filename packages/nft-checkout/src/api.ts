import { Fetcher } from '@distributedlab/fetcher'

export const checkoutApi = new Fetcher({
  baseUrl: 'http://localhost:3000/checkout',
})

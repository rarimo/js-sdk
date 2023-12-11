import type { FetcherRequestOpts } from '@distributedlab/fetcher'

import type { CosmosRequestContext } from '@/types'

export const parseCosmosRequest = (
  context?: Partial<CosmosRequestContext>,
): Partial<{
  'x-cosmos-block-height': string
}> => {
  return {
    ...(context?.blockHeight && {
      'x-cosmos-block-height': context.blockHeight,
    }),
  }
}

export const buildRarimoQuerierOpts = (
  context?: Partial<CosmosRequestContext>,
  list?: boolean,
): FetcherRequestOpts | undefined => {
  return {
    ...(context && { headers: parseCosmosRequest(context) }),
    ...(list && { query: { 'pagination.limit': 100 } }),
  }
}

import {
  JsonApiClient,
  JsonApiLinkFields,
  JsonApiResponse,
} from '@distributedlab/jac'

export const CONFIG = {
  CORE_API_BASE_URL: 'https://api.rarify.tokend.io',
  DEX_API_BASE_URL: 'https://api.testnet.rarimo.com/dexoracle',
  MAX_PAGE_LIMIT: 100,
}

const getOrigin = (): string => {
  if (typeof window === 'undefined') return ''
  return window?.origin ?? ''
}

const createApi = (baseUrl: string): JsonApiClient => {
  return new JsonApiClient({
    baseUrl,
    headers: {
      'Content-Type': 'application/json',
      Origin: getOrigin(),
    },
    credentials: 'omit',
  })
}

export const coreApi = createApi(CONFIG.CORE_API_BASE_URL)
export const dexApi = createApi(CONFIG.DEX_API_BASE_URL)

export const loadAllPagesData = async <T extends Array<unknown>>(
  response: JsonApiResponse<T>,
  defaultPageLimit = CONFIG.MAX_PAGE_LIMIT,
): Promise<T> => {
  const data = response.data
  const pageLimit = response.pageLimit || defaultPageLimit

  while ((response.data as unknown as Array<T>).length === pageLimit) {
    response = await response.fetchPage(JsonApiLinkFields.next)
    const newResponseData = response.data as unknown as Array<T>
    data.push(...newResponseData)
  }

  return data as unknown as T
}

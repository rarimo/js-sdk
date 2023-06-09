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

const createApi = (baseUrl: string): JsonApiClient => {
  return new JsonApiClient({
    baseUrl,
    headers: {
      'Content-Type': 'application/json',
      Origin: window?.origin ?? '',
    },
    credentials: 'omit',
  })
}

export const coreApi = createApi(CONFIG.CORE_API_BASE_URL)
export const dexApi = createApi(CONFIG.DEX_API_BASE_URL)

export const loadDataViaLoop = async <T>(
  response: JsonApiResponse<T>,
  defaultPageLimit = CONFIG.MAX_PAGE_LIMIT,
): Promise<T> => {
  let data = response.data as unknown as Array<T>
  const pageLimit = response.pageLimit || defaultPageLimit

  while ((response.data as unknown as Array<T>).length === pageLimit) {
    response = await response.fetchPage(JsonApiLinkFields.next)
    const newResponseData = response.data as unknown as Array<T>
    data = [...data, ...newResponseData]
  }

  return data as unknown as T
}

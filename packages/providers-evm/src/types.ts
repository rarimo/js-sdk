export interface EthProviderRpcError extends Error {
  code: number | string
  data?: unknown
}

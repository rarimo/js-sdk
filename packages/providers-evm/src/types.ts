export interface EthProviderRpcError extends Error {
  message: string
  code: number | string
  data?: unknown
}

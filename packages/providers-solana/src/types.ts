export type SolanaProviderRpcError = {
  error: {
    code: number
    message: string
  }
  name: string
  code?: number
  message?: string
}

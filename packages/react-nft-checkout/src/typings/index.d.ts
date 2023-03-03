import { EthereumProvider } from '@rarimo/provider'

declare global {
  interface Window {
    ethereum?: EthereumProvider
    solflare?: {
      isSolflare: boolean
    }
    solana?: unknown
  }
}

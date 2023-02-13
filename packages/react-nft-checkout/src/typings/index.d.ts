import { EthereumProvider } from '@/types'

declare global {
  interface Window {
    ethereum?: EthereumProvider
    solflare?: {
      isSolflare: boolean
    }
    solana?: unknown
  }
}

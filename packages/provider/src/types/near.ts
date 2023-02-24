import { nearProvider } from '../helpers'

export enum ENearWalletId {
  MyNearWallet = 'my-near-wallet',
}

export type NearTxRequestBody = {
  contractId: string
  method: string
  args?: Record<string, unknown>
  gas?: string
  deposit?: string
}

export type NearProvider = typeof nearProvider

export type NearProviderRpcError = {
  name: string
  cause: {
    info: unknown
    name: string
  }
  code: number
  data: unknown
  message: string
}

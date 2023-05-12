export enum ENearWalletId {
  MyNearWallet = 'my-near-wallet',
}

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

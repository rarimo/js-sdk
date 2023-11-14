export type Config = {
  rpcUrl: string
  apiUrl: string
  prefix: string
  chainName: string
  chainIconUrl: string
  currency: {
    denom: string
    minDenom: string
    decimals: number
  }
  gasPrice: {
    amount: number
    steps: {
      low: number
      average: number
      high: number
    }
  }
}

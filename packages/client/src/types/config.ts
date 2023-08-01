export type Config = {
  rpcUrl: string
  apiUrl: string
  prefix: string
  currency: {
    denom: string
    minDenom: string
    decimals: number
  }
  gasPriceSteps: {
    low: number
    average: number
    high: number
  }
  tx: {
    amount: [{ denom: string; amount: string }]
    gas: string
  }
}

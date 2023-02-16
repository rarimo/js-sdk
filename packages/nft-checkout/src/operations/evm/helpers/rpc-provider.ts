import { JsonRpcProvider } from '@ethersproject/providers'
import { ChainId } from '@rarimo/provider'

export const newRpcProvider = (url: string, chainId: ChainId) => {
  return new JsonRpcProvider(url, chainId)
}

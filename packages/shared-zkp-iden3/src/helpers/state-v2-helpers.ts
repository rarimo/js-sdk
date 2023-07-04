import type { Provider } from '@ethersproject/providers'
import type { RawProvider } from '@rarimo/provider'
import { providers } from 'ethers'

import { StateV2__factory } from '@/types'

export const getGISTProof = async ({
  rpcUrl,
  rawProvider,
  contractAddress,
  userId,
}: {
  rpcUrl?: string
  rawProvider?: RawProvider
  contractAddress: string
  userId: string
}) => {
  const contractInstance = StateV2__factory.connect(
    contractAddress,
    (rawProvider || new providers.JsonRpcProvider(rpcUrl, 'any')) as Provider,
  )

  return contractInstance.getGISTProof(userId)
}

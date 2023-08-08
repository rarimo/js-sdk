import type { Provider } from '@ethersproject/providers'
import type { RarimoQuerier, StateInfo } from '@rarimo/client'
import type { RawProvider } from '@rarimo/provider'
import { providers } from 'ethers'

import { LightweightStateV2__factory, StateV2__factory } from '@/types'
import type { ILightweightState } from '@/types/contracts/LightweightStateV2'

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

export const getGISTRootInfo = async ({
  rpcUrl,
  rawProvider,
  contractAddress,
}: {
  rpcUrl?: string
  rawProvider?: RawProvider
  contractAddress: string
}): Promise<ILightweightState.GistRootDataStructOutput> => {
  const contractInstance = LightweightStateV2__factory.connect(
    contractAddress,
    (rawProvider || new providers.JsonRpcProvider(rpcUrl, 'any')) as Provider,
  )

  return contractInstance.getCurrentGISTRootInfo()
}

export const getCoreChainStateInfo = async (
  querier: RarimoQuerier,
  id: string,
): Promise<StateInfo> => {
  return querier.getState(id)
}

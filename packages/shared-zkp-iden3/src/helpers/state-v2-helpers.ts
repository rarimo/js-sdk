import type { Provider } from '@ethersproject/providers'
import type {
  IdentityNode,
  IdentityParams,
  RarimoQuerier,
  StateInfo,
} from '@rarimo/client'
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

export const getTransitStateTxBody = (
  contractAddress: string,
  newIdentitiesStatesRoot_: string,
  gistData_: ILightweightState.GistRootDataStruct,
  proof_: string,
) => {
  const contractInterface = LightweightStateV2__factory.createInterface()

  const data = contractInterface.encodeFunctionData('signedTransitState', [
    newIdentitiesStatesRoot_,
    gistData_,
    proof_,
  ])

  return {
    to: contractAddress,
    data,
  }
}

export const getIdentityParams = async (
  querier: RarimoQuerier,
): Promise<IdentityParams> => {
  return querier.getIdentityParams()
}

export const getIdentityNode = async (
  querier: RarimoQuerier,
  key: string,
): Promise<IdentityNode> => {
  return querier.getIdentityNodeByKey(key)
}

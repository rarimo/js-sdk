import type { Operation, RarimoQuerier, StateInfo } from '@rarimo/client'
import type { RawProvider } from '@rarimo/provider'
import { isString } from '@rarimo/shared'
import { providers } from 'ethers'

import {
  type LightweightStateV2,
  LightweightStateV2__factory,
  type StateV2,
  StateV2__factory,
} from '@/types'
import type { ILightweightState } from '@/types/contracts/LightweightStateV2'

export const getGISTProof = async ({
  rpcUrlOrRawProvider,
  contractAddress,
  userId,
  rootHash,
}: {
  rpcUrlOrRawProvider: string | RawProvider
  contractAddress: string
  userId: string
  rootHash?: string
}) => {
  let contractInstance: StateV2

  if (isString(rpcUrlOrRawProvider)) {
    contractInstance = StateV2__factory.connect(
      contractAddress,
      new providers.JsonRpcProvider(rpcUrlOrRawProvider, 'any'),
    )
  } else {
    contractInstance = StateV2__factory.connect(
      contractAddress,
      new providers.Web3Provider(
        rpcUrlOrRawProvider as providers.ExternalProvider,
      ),
    )
  }

  return rootHash
    ? contractInstance.getGISTProofByRoot(userId, rootHash)
    : contractInstance.getGISTProof(userId)
}

export const getGISTRootInfo = async ({
  rpcUrlOrRawProvider,
  contractAddress,
}: {
  rpcUrlOrRawProvider: string | RawProvider
  contractAddress: string
}): Promise<ILightweightState.GistRootDataStructOutput> => {
  let contractInstance: LightweightStateV2

  if (isString(rpcUrlOrRawProvider)) {
    contractInstance = LightweightStateV2__factory.connect(
      contractAddress,
      new providers.JsonRpcProvider(rpcUrlOrRawProvider, 'any'),
    )
  } else {
    contractInstance = LightweightStateV2__factory.connect(
      contractAddress,
      new providers.Web3Provider(
        rpcUrlOrRawProvider as providers.ExternalProvider,
      ),
    )
  }

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

export const getOperation = async (
  querier: RarimoQuerier,
  index: string,
): Promise<Operation> => {
  return querier.getOperation(index)
}

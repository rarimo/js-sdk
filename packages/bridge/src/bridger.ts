import type { IProvider } from '@rarimo/provider'

import { errors } from '@/errors'
import type { Bridger, BridgerCreateFn } from '@/types'

const validateBridger = (bridger: Bridger): Bridger => {
  if (bridger.chainType !== bridger.provider.chainType!) {
    throw new errors.BridgerInvalidChainTypeError()
  }

  return bridger
}

export const createBridger = (
  bridgerCreateFn: BridgerCreateFn,
  provider: IProvider,
): Bridger => validateBridger(bridgerCreateFn(provider))

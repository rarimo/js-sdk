import type { IProvider } from '@rarimo/provider'

import { errors } from '@/errors'
import type { IBridger, IBridgerCreateFn } from '@/types'

const validateOpts = (bridger: IBridger): IBridger => {
  if (bridger.chainType !== bridger.provider.chainType!) {
    throw new errors.BridgerInvalidChainTypeError()
  }

  return bridger
}

export const createBridger = (
  bridgerCreateFn: IBridgerCreateFn,
  provider: IProvider,
) => validateOpts(bridgerCreateFn(provider))

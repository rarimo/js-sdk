import type { Token } from '@rarimo/bridge'
import {
  Amount,
  type BridgeChain,
  BUNDLE_SALT_BYTES,
  isUndefined,
  NATIVE_TOKEN_ADDRESS,
  type TransactionBundle,
} from '@rarimo/shared'
import { utils } from 'ethers'

import { SwapCommands } from '@/enums'
import type { CommandPayload, IntermediateTokenOpts } from '@/types'

import { buildIntermediateBundleData } from './intermediate-bundle'
import { buildPayload } from './payload'

export const getBridgeData = (
  isBridgingRequired: boolean,
  intermediateOpts: IntermediateTokenOpts,
  chainTo: BridgeChain,
  to: Token,
  amountOut: Amount,
  receiver: string,
  _bundle?: TransactionBundle,
  isWrapped?: boolean,
): CommandPayload[] => {
  if (!isBridgingRequired) return []

  if (isUndefined(isWrapped) || !intermediateOpts) {
    throw new TypeError(
      'isWrapped, intermediateOpts arguments are required for bridging',
    )
  }

  const bundle = {
    salt: _bundle?.salt || utils.hexlify(utils.randomBytes(BUNDLE_SALT_BYTES)),
    bundle: buildIntermediateBundleData(
      intermediateOpts,
      chainTo,
      receiver,
      _bundle,
    ),
  }

  return [
    buildPayload(
      to.isNative ? SwapCommands.BridgeNative : SwapCommands.BridgeErc20,
      [
        { feeToken: to.isNative ? NATIVE_TOKEN_ADDRESS : to.address },
        {
          ...(!to.isNative && { token: to.address, isWrapped }),
          amount: amountOut.value,
          bundle,
          network: chainTo.name,
          receiver,
        },
      ],
    ),
  ]
}

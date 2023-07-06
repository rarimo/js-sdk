import type { Token } from '@rarimo/bridge'
import {
  Amount,
  type BridgeChain,
  BUNDLE_SALT_BYTES,
  isUndefined,
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
  bundle?: TransactionBundle,
  isWrapped?: boolean,
): CommandPayload[] => {
  if (!isBridgingRequired) return []

  if (isUndefined(isWrapped) || !intermediateOpts) {
    throw new TypeError(
      'isWrapped, intermediateOpts arguments are required for bridging',
    )
  }

  const bundleTuple = [
    bundle?.salt || utils.hexlify(utils.randomBytes(BUNDLE_SALT_BYTES)),
    buildIntermediateBundleData(intermediateOpts, chainTo, receiver, bundle),
  ]

  return [
    buildPayload(
      to.isNative ? SwapCommands.BridgeNative : SwapCommands.BridgeErc20,
      [
        ...(to.isNative ? [] : [to.address]),
        amountOut.value,
        bundleTuple,
        chainTo.name,
        receiver,
        ...(to.isNative ? [] : [isWrapped]),
      ],
    ),
  ]
}

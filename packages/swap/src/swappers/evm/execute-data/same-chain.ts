import type { TransactionBundle } from '@rarimo/shared'

import { SwapCommands } from '@/enums'
import type { CommandPayload } from '@/types'

export const getSameChainBundleData = (
  isBridgingRequired: boolean,
  bundle?: TransactionBundle,
): CommandPayload[] => {
  if (isBridgingRequired) return []
  return buildSameChainBundleData(bundle)
}

export const buildSameChainBundleData = (
  { bundle } = {} as TransactionBundle,
): CommandPayload[] => {
  if (!bundle) return []
  // If bridging is not required and a bundle is provided, thus we need to execute
  // a bundle on the same chain. To execute the transaction bundle on the same
  // chain, we need to use multicall
  return [
    {
      command: SwapCommands.Multicall,
      skipRevert: false,
      data: bundle,
    },
  ]
}

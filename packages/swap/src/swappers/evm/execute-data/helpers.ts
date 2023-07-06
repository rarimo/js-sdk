import type { Token } from '@rarimo/bridge'
import {
  type BridgeChain,
  MASTER_ROUTER_ABI,
  toLowerCase,
} from '@rarimo/shared'
import { utils } from 'ethers'

import { WRAPPED_CHAIN_TOKEN_SYMBOLS } from '@/const'
import type { CommandPayload } from '@/types'

export const getIsWrappedOrUnwrappedRequired = (from: Token, to: Token) => {
  const isWrapRequired =
    from.isNative &&
    toLowerCase(WRAPPED_CHAIN_TOKEN_SYMBOLS[Number(from.chain.id)]) ===
      toLowerCase(to.symbol)

  const isUnwrapRequired =
    toLowerCase(WRAPPED_CHAIN_TOKEN_SYMBOLS[Number(from.chain.id)]) ===
      toLowerCase(from.symbol) &&
    toLowerCase(to.symbol) === toLowerCase(to.chain.token.symbol)

  return { isWrapRequired, isUnwrapRequired }
}

export const getIsBridgingRequired = (
  chainFrom: BridgeChain,
  chainTo: BridgeChain,
) => {
  return Number(chainFrom.id) !== Number(chainTo.id)
}

export const encodeCommandPayload = (data: CommandPayload[]): string => {
  return new utils.Interface(MASTER_ROUTER_ABI).encodeFunctionData('make', [
    data,
  ])
}

import type { Token } from '@rarimo/bridge'

import { CALLER_ADDRESS, CONTRACT_BALANCE } from '@/const'
import { SwapCommands } from '@/enums'
import type { CommandPayload } from '@/types'

import { buildPayload } from './payload'

export const getTransferData = (
  _token: Token,
  receiver: string = CALLER_ADDRESS,
): CommandPayload[] => {
  // If the token wasn't bridged thus transfer to the receiver is required,
  // otherwise we will transfer change after swap operation which should be 0
  // but better to be sure that all tokens were transferred to the receiver
  const command = _token.isNative
    ? SwapCommands.TransferNative
    : SwapCommands.TransferErc20
  const token = _token.isNative ? [] : [_token.address]

  // We transfer amount of the tokens that left on the swap-contract balance
  // to the receiver to be sure that the contract balance is empty
  return [buildPayload(command, [...token, receiver, CONTRACT_BALANCE])]
}

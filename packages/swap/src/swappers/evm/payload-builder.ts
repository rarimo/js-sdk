import {
  BRIDGE_ROUTER_ABI,
  MASTER_ROUTER_ABI,
  MULTICALL_ROUTER_ABI,
  TRADER_JOE_ROUTER_ABI,
  TRANSFER_ROUTER_ABI,
  UNISWAP_V2_ROUTER_ABI,
  UNISWAP_V3_ROUTER,
  WRAP_ROUTER_ABI,
} from '@rarimo/shared'
import { utils } from 'ethers'

import { SWAP_COMMANDS_NAME_MAP } from '@/const'
import type { SwapCommands } from '@/enums'

const ABIS = [
  MASTER_ROUTER_ABI,
  BRIDGE_ROUTER_ABI,
  MULTICALL_ROUTER_ABI,
  TRADER_JOE_ROUTER_ABI,
  TRANSFER_ROUTER_ABI,
  UNISWAP_V2_ROUTER_ABI,
  UNISWAP_V3_ROUTER,
  WRAP_ROUTER_ABI,
]

export const buildPayload = <I, T extends Array<I>>(
  cmd: SwapCommands,
  values: T,
) => {
  const command = SWAP_COMMANDS_NAME_MAP[cmd]

  if (!command) {
    throw new Error(`Unknown command ${cmd}`)
  }

  const isFragmentExists = (j: { name: string; type: string }) => {
    return j.type === 'function' && j.name === command
  }

  const abi = ABIS.find(i => i.some(isFragmentExists))

  if (!abi) {
    throw new Error(`ABI for command ${command} not found`)
  }

  const functionData = new utils.Interface(abi).encodeFunctionData(
    command,
    values,
  )

  console.log({
    command: cmd,
    skipRevert: false,
    data: values,
  })

  return {
    command: cmd,
    skipRevert: false,
    data: '0x' + functionData.slice(10),
  }
}

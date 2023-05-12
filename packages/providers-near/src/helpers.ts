import type { Chain } from '@rarimo/provider'
import { utils } from 'near-api-js'

export const MAX_GAS_LIMIT = '300000000000000'
export const NO_DEPOSIT = '0'

export const nearToYocto = (amount: string): string | null => {
  return utils.format.parseNearAmount(amount)
}

export const yoctoToNear = (amount: string): string | null => {
  return utils.format.formatNearAmount(amount)
}

export function getNearExplorerTxUrl(
  explorerUrl: string | Chain,
  txHash: string,
): string {
  return `${explorerUrl}/transactions/${txHash}`
}

export function getNearExplorerAddressUrl(
  explorerUrl: string | Chain,
  address: string,
): string {
  return `${explorerUrl}/accounts/${address}`
}

export function handleNearError(error: Error): never {
  // TODO: handle error
  throw error
}

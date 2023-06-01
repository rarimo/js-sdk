import type { Chain } from '@rarimo/provider'

import type { SwapContractVersion } from '@/enums'

export type Decimals = number // Token decimals, e.g. 18 for ETH, 6 for USDT, etc
export type HexString = string // Ethereum hex-string
export type Address = HexString // Ethereum hex-string address
export type TokenSymbol = string // Token symbol, e.g. ETH, USDT, etc

export type BridgeChain = Chain & {
  contractAddress: Address
  contactVersion: SwapContractVersion
  isTestnet: boolean
}

export { Chain }

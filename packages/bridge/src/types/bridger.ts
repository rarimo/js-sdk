import type { IProvider, TransactionResponse } from '@rarimo/provider'
import type { BridgeChain, ChainTypes, HexString } from '@rarimo/shared'
import type { Amount } from '@rarimo/shared'

import type { DestinationTransaction } from '@/types'
import type { Token } from '@/types'

export interface Bridger {
  provider: IProvider
  chains: BridgeChain[]
  chainType: ChainTypes
  isInitialized: boolean

  init(): Promise<void>

  /**
   * Get the chains that are supported for the bridging
   *
   * @returns A list of supported chains and information about them
   */
  loadSupportedChains(): Promise<BridgeChain[]>

  /**
   * Get the destination chain transaction hash as the result of the bridging
   *
   * @returns Transaction hash and transaction status
   */
  getDestinationTx(
    sourceChain: BridgeChain,
    sourceTxHash: string,
  ): Promise<DestinationTransaction>

  /**
   * Sets allowance for the provided operator address to spend the token
   *
   * @returns A Transaction Response
   */
  approveIfNeeded(
    token: Token,
    operator: HexString,
    amount?: Amount,
  ): Promise<TransactionResponse | undefined>
}

export type BridgerCreateFn = (p: IProvider) => Bridger

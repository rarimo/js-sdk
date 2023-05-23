import {
  ProviderProxy,
  Providers,
  RawProvider,
  TransactionRequestBody,
  TransactionResponse,
} from '@rarimo/provider'
import { isString } from '@rarimo/shared'
import {
  Cluster,
  clusterApiUrl,
  Connection,
  Transaction as SolTransaction,
} from '@solana/web3.js'

import { decodeSolanaTx, handleSolError } from '@/helpers'
import type { SolanaProviderRpcError } from '@/types'

import { BaseSolanaProvider } from './base-solana'

/**
 * @description Represents a Phantom wallet.
 *
 * @example
 * ```js
 * import { createProvider } from '@rarimo/provider'
 * import { PhantomProvider } from '@rarimo/providers-solana
 *
 * const getPhantomWalletAddress = async () => {
 *   // Connect to the Phantom wallet in the browser, using the PhantomProvider interface to limit bundle size.
 *   const provider = await createProvider(PhantomProvider)
 *   await provider.connect()
 *
 *   // Get the address of the wallet
 *   console.log(provider.address)
 * }
 * ```
 */
export class PhantomProvider
  extends BaseSolanaProvider
  implements ProviderProxy
{
  /**
   * @description In most cases, instead of using this constructor, pass the PhantomProvider class to {@link @rarimo/provider!createProvider}.
   */
  constructor(provider?: RawProvider) {
    super(provider)
  }

  static get providerType(): Providers {
    return Providers.Phantom
  }

  async signAndSendTx(
    txRequestBody: TransactionRequestBody,
  ): Promise<TransactionResponse> {
    try {
      const txBody = isString(txRequestBody)
        ? decodeSolanaTx(txRequestBody)
        : txRequestBody

      const connection = new Connection(clusterApiUrl(this.chainId as Cluster))

      const { signature } = await this.provider.signAndSendTransaction(
        txBody as SolTransaction,
      )
      await connection.confirmTransaction(signature)
      return signature
    } catch (error) {
      handleSolError(error as SolanaProviderRpcError)
    }

    return ''
  }
}

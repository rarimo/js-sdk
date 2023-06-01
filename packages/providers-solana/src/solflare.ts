import type {
  ProviderProxy,
  RawProvider,
  TransactionRequestBody,
  TransactionResponse,
} from '@rarimo/provider'
import { Providers } from '@rarimo/provider'
import { isString } from '@rarimo/shared'
import type { Cluster } from '@solana/web3.js'
import {
  clusterApiUrl,
  Connection,
  Transaction as SolTransaction,
} from '@solana/web3.js'

import { decodeSolanaTx, handleSolError } from '@/helpers'
import type { SolanaProviderRpcError } from '@/types'

import { BaseSolanaProvider } from './base-solana'

/**
 * @description Represents a Solflare wallet.
 *
 * @example
 * ```js
 * import { createProvider } from '@rarimo/provider'
 * import { SolflareProvider } from '@rarimo/providers-solana
 *
 * const getSolflareWalletAddress = async () => {
 *   // Connect to the Solflare wallet in the browser, using the SolflareProvider interface to limit bundle size.
 *   const provider = await createProvider(SolflareProvider)
 *   await provider.connect()
 *
 *   // Get the address of the wallet
 *   console.log(provider.address)
 * }
 * ```
 */
export class SolflareProvider
  extends BaseSolanaProvider
  implements ProviderProxy
{
  /**
   * @description In most cases, instead of using this constructor, pass the SolflareProvider class to {@link @rarimo/provider!createProvider}.
   */
  constructor(provider?: RawProvider) {
    super(provider)
  }

  static get providerType(): Providers {
    return Providers.Solflare
  }

  async signAndSendTx(
    txRequestBody: TransactionRequestBody,
  ): Promise<TransactionResponse> {
    try {
      const txBody = isString(txRequestBody)
        ? decodeSolanaTx(txRequestBody)
        : txRequestBody

      const signedTx = await this.provider.signTransaction(
        txBody as SolTransaction,
      )

      const connection = new Connection(clusterApiUrl(this.chainId as Cluster))

      const signature = await connection.sendRawTransaction(
        signedTx.serialize(),
      )
      await connection.confirmTransaction(signature)
      return signature
    } catch (error) {
      handleSolError(error as SolanaProviderRpcError)
    }

    return ''
  }
}

import {
  ProviderProxy,
  Providers,
  RawProvider,
  TransactionRequestBody,
  TransactionResponse,
} from '@rarimo/provider'
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
 * @description Represents a Solflare wallet.
 *
 * @example
 * ```js
 * import { createProvider, SolflareProvider } from '@rarimo/provider'
 *
 * const getSolflareWalletAddress = async () => {
 *   // Connect to the Solflare wallet in the browser using Web3.js, using the SolflareProvider interface to limit bundle size.
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
      const txBody =
        typeof txRequestBody === 'string'
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

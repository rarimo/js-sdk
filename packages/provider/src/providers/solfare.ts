import Web3 from 'web3/types'
import {
  ProviderProxy,
  RawProvider,
  SolanaProviderRpcError,
  TransactionResponse,
  TxRequestBody,
} from '../types'
import { decodeSolanaTx, handleSolError } from '../helpers'
import {
  Connection,
  Cluster,
  clusterApiUrl,
  Transaction as SolTransaction,
} from '@solana/web3.js'
import { BaseSolanaProvider } from './base-solana'
import { Providers } from '../enums'
declare global {
  interface Window {
    Web3: typeof Web3
  }
}

/**
 * @description Represents a Solflare wallet.
 *
 * @example
 * ```js
 * import { createProvider, SolfareProvider } from '@rarimo/provider'
 *
 * const getSolflareWalletAddress = async () => {
 *   // Connect to the Solflare wallet in the browser using Web3.js, using the SolfareProvider interface to limit bundle size.
 *   const provider = await createProvider(SolfareProvider)
 *   await provider.connect()
 *
 *   // Get the address of the wallet
 *   console.log(provider.address)
 * }
 * ```
 */
export class SolfareProvider
  extends BaseSolanaProvider
  implements ProviderProxy
{
  constructor(provider: RawProvider) {
    super(provider)
  }

  static get providerType(): Providers {
    return Providers.Solflare
  }

  async signAndSendTx(
    txRequestBody: TxRequestBody,
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
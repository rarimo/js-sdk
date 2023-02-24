import {
  ProviderProxy,
  RawProvider,
  SolanaProviderRpcError,
  TransactionResponse,
  TxRequestBody,
} from '../types'
import { decodeSolanaTx, handleSolError } from '../helpers'
import {
  Cluster,
  clusterApiUrl,
  Connection,
  Transaction as SolTransaction,
} from '@solana/web3.js'
import { BaseSolanaProvider } from './base-solana'
import { Providers } from '../enums'

export class PhantomProvider
  extends BaseSolanaProvider
  implements ProviderProxy
{
  constructor(provider: RawProvider) {
    super(provider)
  }

  static get providerType(): Providers {
    return Providers.Phantom
  }

  async signAndSendTx(
    txRequestBody: TxRequestBody,
  ): Promise<TransactionResponse> {
    try {
      const txBody =
        typeof txRequestBody === 'string'
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

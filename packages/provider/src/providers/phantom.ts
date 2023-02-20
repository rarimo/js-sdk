import Web3 from 'web3/types'
import {
  ChainId,
  EthProviderRpcError,
  PhantomProvider as _PhantomProvider,
  ProviderProxy,
  RawProvider,
  SolanaProviderRpcError,
  TransactionResponse,
  TxRequestBody,
} from '@/types'
import { HttpProvider } from 'web3-core'
import { ChainTypes, ProviderEvents } from '@/enums'
import { decodeSolanaTx, handleEthError, handleSolError } from '@/helpers'
import {
  Connection,
  Cluster,
  clusterApiUrl,
  Transaction as SolTransaction,
  PublicKey,
} from '@solana/web3.js'
declare global {
  interface Window {
    Web3: typeof Web3
  }
}

export class PhantomProvider implements ProviderProxy {
  readonly #provider: _PhantomProvider
  #isConnected = false
  #web3: Web3
  #chainId?: ChainId
  #address?: string

  constructor(provider: RawProvider) {
    this.#web3 = new window.Web3(provider as unknown as HttpProvider)
    this.#provider = (<unknown>this.#web3?.currentProvider) as _PhantomProvider
    this.#isConnected = false
  }

  get chainType(): ChainTypes {
    return ChainTypes.Solana
  }

  get isConnected(): boolean {
    return this.#isConnected
  }

  get chainId(): ChainId | undefined {
    return this.#chainId
  }

  get address(): string | undefined {
    return this.#address
  }

  async init(): Promise<void> {
    this.#setListeners()
    await this._updateProviderState()
  }

  async switchChain(_chainId: ChainId) {
    try {
      this.#chainId = _chainId
    } catch (error) {
      handleSolError(error as SolanaProviderRpcError)
    }
  }

  async connect(): Promise<void> {
    try {
      await this.#provider.connect()
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  disconnect(): Promise<void> {
    return Promise.resolve(undefined)
  }

  async signAndSendTx(
    txRequestBody: TxRequestBody,
  ): Promise<TransactionResponse> {
    try {
      const txBody =
        typeof txRequestBody === 'string'
          ? decodeSolanaTx(txRequestBody)
          : txRequestBody

      const connection = new Connection(clusterApiUrl(this.#chainId as Cluster))

      const { signature } = await this.#provider.signAndSendTransaction(
        txBody as SolTransaction,
      )
      await connection.confirmTransaction(signature)
      return signature
    } catch (error) {
      handleSolError(error as SolanaProviderRpcError)
    }

    return ''
  }

  #setListeners() {
    this.#provider.on(ProviderEvents.Connect, () => {
      this._updateProviderState()
    })

    this.#provider.on(ProviderEvents.Disconnect, () => {
      this._updateProviderState()
    })

    this.#provider.on(ProviderEvents.AccountChanged, () => {
      this._updateProviderState()
    })
  }

  async _updateProviderState() {
    const publicKey = this.#provider.publicKey
    this.#address = publicKey ? new PublicKey(publicKey).toBase58() : ''
  }
}

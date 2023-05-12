import type {
  Chain,
  ChainId,
  NearTransactionRequestBody,
  ProviderProxy,
  TransactionRequestBody,
  TransactionResponse,
} from '@rarimo/provider'
import {
  NearChains,
  NearTransactionResponse,
  ProviderEventBus,
  ProviderEventBusEvents,
  Providers,
} from '@rarimo/provider'

import {
  getNearExplorerAddressUrl,
  getNearExplorerTxUrl,
  handleNearError,
} from '@/helpers'
import { NearRawProvider } from '@/near-raw-provider'
import type { NearProviderRpcError } from '@/types'

export class NearProvider extends ProviderEventBus implements ProviderProxy {
  readonly #provider: NearRawProvider

  #chainId?: ChainId
  #address?: string

  constructor() {
    super()
    this.#provider = this.#provider = new NearRawProvider({})
  }

  static get providerType(): Providers {
    return Providers.Near
  }

  get isConnected(): boolean {
    return Boolean(this.#chainId && this.#address)
  }

  get chainId(): ChainId | undefined {
    return this.#chainId
  }

  get address(): string | undefined {
    return this.#address
  }

  async init(): Promise<void> {
    try {
      await this.#provider.init()
      this.#updateProviderState()
      this.#emitEvent(ProviderEventBusEvents.Initiated)
    } catch (error) {
      handleNearError(error as NearProviderRpcError)
    }
  }

  #updateProviderState(): void {
    const networkId = this.#provider.selector?.options.network.networkId
    this.#address = this.#provider?.accountId || ''
    this.#chainId = networkId || NearChains.TestNet
  }

  async switchChain(chainId: ChainId): Promise<void> {
    this.#chainId = chainId
    this.#emitEvent(ProviderEventBusEvents.ChainChanged)
  }

  async connect(): Promise<void> {
    try {
      await this.#provider.signIn()
      await this.#updateProviderState()
      this.#emitEvent(ProviderEventBusEvents.Connect)
    } catch (error) {
      handleNearError(error as NearProviderRpcError)
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.#provider.signOut()
      this.#updateProviderState()
      this.#emitEvent(ProviderEventBusEvents.Disconnect)
    } catch (error) {
      handleNearError(error as NearProviderRpcError)
    }
  }

  getHashFromTxResponse(txResponse: NearTransactionResponse): string {
    const transactionResponse = txResponse as NearTransactionResponse

    return transactionResponse.transaction.hash
  }

  getTxUrl(chain: Chain, txHash: string): string {
    return getNearExplorerTxUrl(chain, txHash)
  }

  getAddressUrl(chain: Chain, address: string): string {
    return getNearExplorerAddressUrl(chain, address)
  }

  async signAndSendTx(
    txRequestBody: TransactionRequestBody,
  ): Promise<TransactionResponse> {
    try {
      return await this.#provider.signAndSendTx(
        txRequestBody as NearTransactionRequestBody,
      )
    } catch (error) {
      handleNearError(error as NearProviderRpcError)
    }
  }

  #emitEvent(event: ProviderEventBusEvents) {
    this.emit(event, {
      address: this.#address,
      chainId: this.#chainId,
      isConnected: this.isConnected,
    })
  }
}

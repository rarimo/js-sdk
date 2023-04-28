import { NearChains, ProviderEventBusEvents, Providers } from '@/enums'
import {
  getNearExplorerAddressUrl,
  getNearExplorerTxUrl,
  handleNearError,
} from '@/helpers'
import type {
  Chain,
  ChainId,
  NearMultipleTxRequestBody,
  NearProviderRpcError,
  NearProviderType,
  NearTransactionResponse,
  ProviderProxy,
  RawProvider,
  TransactionResponse,
  TxRequestBody,
} from '@/types'

import { ProviderEventBus } from './event-bus'

export class NearProvider extends ProviderEventBus implements ProviderProxy {
  readonly #provider: NearProviderType

  #chainId?: ChainId
  #address?: string

  constructor(provider: RawProvider) {
    super()
    this.#provider = provider as NearProviderType
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

  getHashFromTxResponse(txResponse: TransactionResponse): string {
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
    txRequestBody: TxRequestBody,
  ): Promise<TransactionResponse> {
    try {
      return this.#provider.signAndSendTx(txRequestBody)
    } catch (error) {
      handleNearError(error as NearProviderRpcError)
    }
  }

  async signAndSendTxs(
    txRequestBodies: NearMultipleTxRequestBody,
  ): Promise<TransactionResponse[]> {
    try {
      return this.#provider.signAndSendTxs(txRequestBodies)
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

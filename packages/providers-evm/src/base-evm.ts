import type { TransactionRequest } from '@ethersproject/abstract-provider'
import type { Deferrable } from '@ethersproject/properties'
import {
  Chain,
  ChainId,
  ChainTypes,
  errors,
  ProviderEventBus,
  ProviderEventBusEvents,
  ProviderEvents,
  ProviderProxy,
  RawProvider,
  TransactionRequestBody,
  TransactionResponse,
} from '@rarimo/provider'
import { ethers, providers } from 'ethers'

import {
  connectEthAccounts,
  getEthExplorerAddressUrl,
  getEthExplorerTxUrl,
  hexToDecimal,
  requestAddEthChain,
  requestSwitchEthChain,
  wrapExternalEthProvider,
} from '@/helpers'

export class BaseEVMProvider extends ProviderEventBus implements ProviderProxy {
  readonly #provider: providers.Web3Provider

  #chainId?: ChainId
  #address?: string

  constructor(provider?: RawProvider) {
    if (!provider) throw new errors.ProviderInjectedInstanceNotFoundError()
    super()
    if (provider instanceof providers.Web3Provider) {
      this.#provider = provider
      return
    }
    this.#provider = new ethers.providers.Web3Provider(
      wrapExternalEthProvider(provider as ethers.providers.ExternalProvider),
      'any',
    )
  }

  get chainType(): ChainTypes {
    return ChainTypes.EVM
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

  getWeb3Provider(): providers.Web3Provider {
    return this.#provider
  }

  async init(): Promise<void> {
    await this.#setListeners()
    const currentAccounts = await this.#provider.listAccounts()
    const network = await this.#provider.getNetwork()

    this.#address = currentAccounts[0]
    this.#chainId = hexToDecimal(network.chainId as ChainId)

    this.#emitEvent(ProviderEventBusEvents.Initiated)
  }

  async switchChain(chainId: ChainId): Promise<void> {
    await requestSwitchEthChain(this.#provider, chainId)
  }

  async addChain(chain: Chain): Promise<void> {
    await requestAddEthChain(
      this.#provider,
      Number(chain.id),
      chain.name,
      chain.rpcUrl,
    )
  }

  async connect(): Promise<void> {
    await connectEthAccounts(this.#provider)
  }

  getAddressUrl(chain: Chain, address: string): string {
    return getEthExplorerAddressUrl(chain, address)
  }

  getTxUrl(chain: Chain, txHash: string): string {
    return getEthExplorerTxUrl(chain, txHash)
  }

  async signAndSendTx(
    tx: TransactionRequestBody,
  ): Promise<TransactionResponse> {
    const transactionResponse = await this.#provider
      .getSigner()
      .sendTransaction(tx as Deferrable<TransactionRequest>)

    return transactionResponse.wait()
  }

  async #setListeners() {
    const stubProvider = this.#provider.provider as providers.BaseProvider

    stubProvider.on(ProviderEvents.AccountsChanged, async () => {
      const currentAccounts = await this.#provider.listAccounts()
      this.#address = currentAccounts[0] ?? ''

      this.#emitEvent(ProviderEventBusEvents.AccountChanged)
      this.#emitEvent(
        this.isConnected
          ? ProviderEventBusEvents.Connect
          : ProviderEventBusEvents.Disconnect,
      )
    })

    stubProvider.on(ProviderEvents.ChainChanged, (chainId: ChainId) => {
      this.#chainId = hexToDecimal(chainId)
      this.#emitEvent(ProviderEventBusEvents.ChainChanged)
    })
  }

  #emitEvent(event: ProviderEventBusEvents) {
    this.emit(event, {
      address: this.#address,
      chainId: this.#chainId,
      isConnected: this.isConnected,
    })
  }
}

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
  handleEthError,
  hexToDecimal,
  requestAddEthChain,
  requestSwitchEthChain,
} from '@/helpers'
import type { EthProviderRpcError } from '@/types'

export class BaseEVMProvider extends ProviderEventBus implements ProviderProxy {
  readonly #provider: providers.Web3Provider

  #chainId?: ChainId
  #address?: string

  constructor(provider?: RawProvider) {
    if (!provider) throw new errors.ProviderInjectedInstanceNotFoundError()
    super()
    this.#provider = new ethers.providers.Web3Provider(
      provider as ethers.providers.ExternalProvider,
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
    try {
      await requestSwitchEthChain(this.#provider, chainId)
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  async addChain(chain: Chain): Promise<void> {
    try {
      await requestAddEthChain(
        this.#provider,
        Number(chain.id),
        chain.name,
        chain.rpcUrl,
      )
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  async connect(): Promise<void> {
    try {
      await connectEthAccounts(this.#provider)
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
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
    try {
      const transactionResponse = await this.#provider
        .getSigner()
        .sendTransaction(tx as Deferrable<TransactionRequest>)

      return transactionResponse.wait()
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }

    return ''
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

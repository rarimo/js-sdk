import {
  Chain,
  ChainId,
  EthProviderRpcError,
  ProviderProxy,
  RawProvider,
  TransactionResponse,
  TxRequestBody,
} from '../types'
import { ChainTypes, ProviderEvents } from '../enums'
import {
  connectEthAccounts,
  getEthExplorerAddressUrl,
  getEthExplorerTxUrl,
  handleEthError,
  hexToDecimal,
  requestAddEthChain,
  requestSwitchEthChain,
} from '../helpers'
import { ethers, providers } from 'ethers'
import { ProviderEventBus } from './event-bus'
import { Deferrable } from '@ethersproject/properties'
import { TransactionRequest } from '@ethersproject/abstract-provider'

export class BaseEVMProvider extends ProviderEventBus implements ProviderProxy {
  readonly #provider: providers.Web3Provider

  #chainId?: ChainId
  #address?: string

  constructor(provider: RawProvider) {
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
    this.#setListeners()
    const currentAccounts = await this.#provider.listAccounts()
    this.#address = currentAccounts[0]

    this.emitInitiated({
      chainId: this.#chainId,
      address: this.#address,
      isConnected: this.isConnected,
    })
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
        Number(chain),
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

  async signAndSendTx(tx: TxRequestBody): Promise<TransactionResponse> {
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
    this.#provider.on(ProviderEvents.Connect, async () => {
      const currentAccounts = await this.#provider.listAccounts()
      this.#address = currentAccounts[0] ?? ''

      this.emitConnect({
        address: this.#address,
        isConnected: this.isConnected,
      })
    })

    this.#provider.on(ProviderEvents.Disconnect, () => {
      this.#address = ''

      this.emitDisconnect({
        address: this.#address,
        isConnected: this.isConnected,
      })
    })

    this.#provider.on(ProviderEvents.AccountsChanged, async () => {
      const currentAccounts = await this.#provider.listAccounts()
      this.#address = currentAccounts[0] ?? ''

      this.emitAccountChanged({
        address: this.#address,
        isConnected: this.isConnected,
      })
    })

    this.#provider.on(ProviderEvents.ChainChanged, (chainId: ChainId) => {
      this.#chainId = hexToDecimal(chainId)

      this.emitChainChanged({
        chainId: this.#chainId,
      })
    })
  }
}

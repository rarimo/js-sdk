import {
  Chain,
  ChainId,
  EthereumProvider,
  EthProviderRpcError,
  ProviderProxy,
  RawProvider,
  TransactionResponse,
  TxRequestBody,
} from '../types'
import { HttpProvider, TransactionConfig } from 'web3-core'
import Web3 from 'web3/types'
import { ChainTypes, ProviderEvents } from '../enums'
import {
  connectEthProvider,
  detectCurrentEthChain,
  getEthExplorerAddressUrl,
  getEthExplorerTxUrl,
  handleEthError,
  hexToDecimal,
  requestAddEthChain,
  requestSwitchEthChain,
} from '../helpers'
import { providers } from 'ethers'
import { ProviderEventBus } from './event-bus'

export class BaseEVMProvider extends ProviderEventBus implements ProviderProxy {
  readonly #provider: EthereumProvider
  readonly #web3: Web3

  #chainId?: ChainId
  #address?: string

  constructor(provider: RawProvider) {
    super()
    this.#web3 = new window.Web3(provider as unknown as HttpProvider)
    this.#provider = (<unknown>this.#web3?.currentProvider) as EthereumProvider
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
    return new providers.Web3Provider(this.#provider)
  }

  async init(): Promise<void> {
    this.#setListeners()
    await this.#detectCurrentChain()
    this.#address = this.#provider.selectedAddress ?? ''

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
      await requestAddEthChain(this.#provider, chain)
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  async connect(): Promise<void> {
    try {
      await connectEthProvider(this.#provider)
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
      const txReceipt = await this.#web3.eth.sendTransaction(
        tx as TransactionConfig,
      )
      return txReceipt.transactionHash
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }

    return ''
  }

  #setListeners() {
    this.#provider.on(ProviderEvents.Connect, () => {
      this.#address = this.#provider.selectedAddress ?? ''

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

    this.#provider.on(ProviderEvents.AccountsChanged, () => {
      this.#address = this.#provider.selectedAddress ?? ''

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

  async #detectCurrentChain(): Promise<void> {
    try {
      this.#chainId = await detectCurrentEthChain(this.#web3)
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }
}

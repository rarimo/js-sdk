import {
  Chain,
  ChainId,
  EthereumProvider,
  EthProviderRpcError,
  ProviderProxy,
  RawProvider,
  TransactionResponse,
  TxRequestBody,
} from '@/types'
import { HttpProvider } from 'web3-core'
import Web3 from 'web3/types'
import { ChainTypes, ProviderEvents } from '@/enums'
import {
  connectEthProvider,
  detectCurrentEthChain,
  getEthExplorerAddressUrl,
  getEthExplorerTxUrl,
  handleEthError,
  hexToDecimal,
  requestAddEthChain,
  requestSwitchEthChain,
} from '@/helpers'

declare global {
  interface Window {
    Web3: typeof Web3
  }
}

export class MetamaskProvider implements ProviderProxy {
  readonly #provider: EthereumProvider
  #isConnected = false
  #web3: Web3
  #chainId?: ChainId
  #address?: string

  constructor(provider: RawProvider) {
    this.#web3 = new window.Web3(provider as unknown as HttpProvider)
    this.#provider = (<unknown>this.#web3?.currentProvider) as EthereumProvider
    this.#isConnected = false
  }

  get chainType(): ChainTypes {
    return ChainTypes.EVM
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
    await this.#detectCurrentChain()
    this.#isConnected = Boolean(this.#provider.selectedAddress)
    this.#address = this.#provider.selectedAddress ?? ''
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

  disconnect(): Promise<void> {
    return Promise.resolve(undefined)
  }

  getAddressUrl(chain: Chain, address: string): string {
    return getEthExplorerAddressUrl(chain, address)
  }

  getTxUrl(chain: Chain, txHash: string): string {
    return getEthExplorerTxUrl(chain, txHash)
  }

  async signAndSendTx(tx: TxRequestBody): Promise<TransactionResponse> {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const txReceipt = await this.#web3.eth.sendTransaction(tx)
      return txReceipt.transactionHash
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }

    return ''
  }

  #setListeners() {
    this.#provider.on(ProviderEvents.AccountsChanged, () => {
      this.#address = this.#provider.selectedAddress ?? ''
      this.#isConnected = Boolean(this.#address)
    })

    this.#provider.on(ProviderEvents.Disconnect, () => {
      this.#isConnected = false
      this.#address = ''
    })

    this.#provider.on(ProviderEvents.ChainChanged, (chainId: ChainId) => {
      this.#chainId = hexToDecimal(chainId)
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

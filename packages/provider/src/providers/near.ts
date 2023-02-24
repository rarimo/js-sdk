import {
  Chain,
  ChainId,
  EthProviderRpcError,
  NearProvider,
  NearProviderRpcError,
  NearTransactionResponse,
  NearTxRequestBody,
  ProviderProxy,
  RawProvider,
  TransactionResponse,
  TxRequestBody,
} from '../types'
import { HttpProvider, TransactionConfig } from 'web3-core'
import Web3 from 'web3/types'
import { ChainTypes, NEAR_CHAINS } from '../enums'
import {
  getNearExplorerAddressUrl,
  getNearExplorerTxUrl,
  handleEthError,
  handleNearError,
} from '../helpers'

import { ProviderEventBus } from './provider-event-bus'

declare global {
  interface Window {
    Web3: typeof Web3
  }
}

export class NearProviderWrapper
  extends ProviderEventBus
  implements ProviderProxy
{
  readonly #provider: NearProvider
  readonly #web3: Web3

  #isConnected = false
  #chainId?: ChainId
  #address?: string

  constructor(provider: RawProvider) {
    super()
    this.#web3 = new window.Web3(provider as unknown as HttpProvider)
    this.#provider = (<unknown>this.#web3?.currentProvider) as NearProvider
    this.#isConnected = false
  }

  get chainType(): ChainTypes {
    return ChainTypes.Near
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
    try {
      await this.#provider.init()
      this._updateProviderState()
    } catch (error) {
      handleNearError(error as NearProviderRpcError)
    }
  }

  _updateProviderState(): void {
    const networkId = this.#provider.selector?.options.network.networkId

    this.#address = this.#provider?.accountId || ''
    this.#chainId = networkId || NEAR_CHAINS.mainnet
  }

  async switchChain(chainId: ChainId): Promise<void> {
    this.#chainId = chainId
  }

  async connect(): Promise<void> {
    try {
      await this.#provider.signIn()
    } catch (error) {
      handleNearError(error as NearProviderRpcError)
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.#provider.signOut()
      this._updateProviderState()
    } catch (error) {
      handleNearError(error as NearProviderRpcError)
    }
  }

  getHashFromTxResponse(txResponse: TransactionResponse) {
    const transactionResponse = txResponse as NearTransactionResponse

    return transactionResponse.transaction.hash
  }

  getTxUrl(chain: Chain, txHash: string) {
    return getNearExplorerTxUrl(chain, txHash)
  }

  getAddressUrl(chain: Chain, address: string) {
    return getNearExplorerAddressUrl(chain, address)
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

  async signAndSendTransaction(txRequestBody: TxRequestBody) {
    try {
      return await this.#provider.signAndSendTx(
        txRequestBody as NearTxRequestBody,
      )
    } catch (error) {
      handleNearError(error as NearProviderRpcError)
    }
  }
}

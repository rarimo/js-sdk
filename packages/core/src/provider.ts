import { Providers } from '@/enums'
import {
  ChainId,
  ProviderProxy,
  TransactionResponse,
  TxRequestBody,
  ProviderInstance,
  ProviderProxyConstructor,
  IProvider,
} from '@/types'
import { errors } from '@/errors'
import { ethers } from 'ethers'

type ProxyConstructorMap = { [key in Providers]?: ProviderProxyConstructor }

export class Provider implements IProvider {
  #selectedProvider?: Providers
  #proxy?: ProviderProxy
  #proxies?: ProxyConstructorMap

  constructor(proxies: ProxyConstructorMap = {} as ProxyConstructorMap) {
    this.#selectedProvider = undefined
    this.#proxy = undefined
    this.#proxies = proxies
  }

  #ensureMethodImplemented(methodName: string): never | void {
    if (!this.#proxy) {
      throw new errors.ProviderNotInitializedError()
    }
    if (methodName in this.#proxy) {
      throw new errors.ProviderWrapperMethodNotFoundError()
    }
  }

  public get selectedProvider(): Providers | undefined {
    return this.#selectedProvider
  }

  public get isConnected(): boolean {
    return Boolean(this.chainId && this.selectedAddress)
  }

  public get selectedAddress(): string | undefined {
    return this.#proxy?.selectedAddress
  }

  public get chainId(): ChainId | undefined {
    return this.#proxy?.chainId
  }

  public get currentProvider(): ethers.providers.Web3Provider | undefined {
    return this.#proxy?.currentProvider
  }

  public get currentSigner(): ethers.providers.JsonRpcSigner | undefined {
    return this.#proxy?.currentSigner
  }

  public async init(provider: ProviderInstance): Promise<Provider> {
    const proxyConstructor = this.#proxies?.[provider.name]
    if (!proxyConstructor) throw new errors.ProviderConstructorNotExistError()

    this.#proxy = new proxyConstructor(provider.instance)
    this.#selectedProvider = provider.name
    await this.#proxy?.init()
    return this
  }

  public async connect(): Promise<void> {
    if (!this.#proxy) throw new errors.ProviderNotInitializedError()
    await this.#proxy.connect()
  }

  public async disconnect(): Promise<void> {
    if (this.#proxy?.disconnect) {
      await this.#proxy.disconnect()
    } else {
      this.#proxy = undefined
    }
  }

  public async switchChain(chainId: ChainId): Promise<void> {
    this.#ensureMethodImplemented('switchChain')
    await this.#proxy?.switchChain(chainId)
  }

  public async addChain(
    chainId: ChainId,
    chainName: string,
    chainRpcUrl: string,
  ): Promise<void> {
    this.#ensureMethodImplemented('addChain')
    await this.#proxy?.addChain?.(chainId, chainName, chainRpcUrl)
  }

  public async signAndSendTx(
    txRequestBody: TxRequestBody,
  ): Promise<TransactionResponse> {
    this.#ensureMethodImplemented('signAndSendTransaction')
    return this.#proxy?.signAndSendTransaction(txRequestBody)
  }

  public getHashFromTxResponse(txResponse: TransactionResponse): string {
    this.#ensureMethodImplemented('getHashFromTxResponse')
    return this.#proxy?.getHashFromTxResponse?.(txResponse) ?? ''
  }

  public getTxUrl(explorerUrl: string, txHash: string): string {
    this.#ensureMethodImplemented('getTxUrl')
    return this.#proxy?.getTxUrl?.(explorerUrl, txHash) ?? ''
  }

  public getAddressUrl(explorerUrl: string, address: string): string {
    this.#ensureMethodImplemented('getAddressUrl')
    return this.#proxy?.getAddressUrl?.(explorerUrl, address) ?? ''
  }

  public async signMessage(message: string) {
    this.#ensureMethodImplemented('signMessage')
    return this.#proxy?.signMessage?.(message) ?? ''
  }
}

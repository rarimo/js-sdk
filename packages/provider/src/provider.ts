import { ChainTypes, Providers } from '@/enums'
import {
  ChainId,
  ProviderProxy,
  TransactionResponse,
  TxRequestBody,
  ProviderInstance,
  ProviderProxyConstructor,
  IProvider,
  Chain,
} from '@/types'
import { errors } from '@/errors'

type ProxyConstructorMap = { [key in Providers]?: ProviderProxyConstructor }

export class Provider implements IProvider {
  readonly #proxies?: ProxyConstructorMap

  #selectedProvider?: Providers
  #proxy?: ProviderProxy

  constructor(proxies: ProxyConstructorMap = {} as ProxyConstructorMap) {
    this.#selectedProvider = undefined
    this.#proxy = undefined
    this.#proxies = proxies
  }

  #ensureMethodImplemented(methodName: string) {
    if (!this.#proxy) {
      throw new errors.ProviderNotInitializedError()
    }
    if (methodName in this.#proxy) {
      throw new errors.ProviderWrapperMethodNotFoundError()
    }
  }

  public get chainType() {
    return ChainTypes.EVM
  }

  public get providerType() {
    return this.#selectedProvider
  }

  public get isConnected() {
    return Boolean(this.chainId && this.address)
  }

  public get address() {
    return this.#proxy?.address
  }

  public get chainId() {
    return this.#proxy?.chainId
  }

  public async init(provider: ProviderInstance) {
    const proxyConstructor = this.#proxies?.[provider.name]
    if (!proxyConstructor) throw new errors.ProviderConstructorNotExistError()

    this.#proxy = new proxyConstructor(provider.instance)
    this.#selectedProvider = provider.name
    await this.#proxy?.init()
    return this
  }

  public async connect() {
    if (!this.#proxy) throw new errors.ProviderNotInitializedError()
    await this.#proxy.connect()
  }

  public async disconnect() {
    if (this.#proxy?.disconnect) {
      await this.#proxy.disconnect()
    } else {
      this.#proxy = undefined
    }
  }

  public async switchChain(chainId: ChainId) {
    this.#ensureMethodImplemented('switchChain')
    await this.#proxy?.switchChain(chainId)
  }

  public async addChain(chain: Chain) {
    this.#ensureMethodImplemented('addChain')
    await this.#proxy?.addChain?.(chain)
  }

  public async signAndSendTx(txRequestBody: TxRequestBody) {
    this.#ensureMethodImplemented('signAndSendTx')
    return this.#proxy?.signAndSendTx(
      txRequestBody,
    ) as Promise<TransactionResponse>
  }

  public getHashFromTx(txResponse: TransactionResponse) {
    this.#ensureMethodImplemented('getHashFromTx')
    return this.#proxy?.getHashFromTx?.(txResponse) ?? ''
  }

  public getTxUrl(chain: Chain, txHash: string) {
    this.#ensureMethodImplemented('getTxUrl')
    return this.#proxy?.getTxUrl?.(chain, txHash) ?? ''
  }

  public getAddressUrl(chain: Chain, address: string) {
    this.#ensureMethodImplemented('getAddressUrl')
    return this.#proxy?.getAddressUrl?.(chain, address) ?? ''
  }

  public async signMessage(message: string) {
    this.#ensureMethodImplemented('signMessage')
    return this.#proxy?.signMessage?.(message) ?? ''
  }
}

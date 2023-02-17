import { Providers } from '@/enums'
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
import { Web3 } from '@/web3'

export class Provider implements IProvider {
  #proxyConstructor: ProviderProxyConstructor
  #selectedProvider?: Providers
  #proxy?: ProviderProxy

  constructor(proxyConstructor: ProviderProxyConstructor) {
    this.#selectedProvider = undefined
    this.#proxy = undefined
    this.#proxyConstructor = proxyConstructor
  }

  public get chainType() {
    return this.#proxy?.chainType
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
    this.#proxy = new this.#proxyConstructor(provider.instance)
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
    await this.#proxy?.switchChain?.(chainId)
  }

  public async addChain(chain: Chain) {
    await this.#proxy?.addChain?.(chain)
  }

  public async signAndSendTx(txRequestBody: TxRequestBody) {
    return this.#proxy?.signAndSendTx?.(
      txRequestBody,
    ) as Promise<TransactionResponse>
  }

  public getHashFromTx(txResponse: TransactionResponse) {
    return this.#proxy?.getHashFromTx?.(txResponse) ?? ''
  }

  public getTxUrl(chain: Chain, txHash: string) {
    return this.#proxy?.getTxUrl?.(chain, txHash) ?? ''
  }

  public getAddressUrl(chain: Chain, address: string) {
    return this.#proxy?.getAddressUrl?.(chain, address) ?? ''
  }

  public async signMessage(message: string) {
    return this.#proxy?.signMessage?.(message) ?? ''
  }
}

/**
 * @description Creates a provider instance
 *
 * @example
 * const provider = await createProvider(MetamaskProvider)
 */
export const createProvider = async (
  proxy: ProviderProxyConstructor,
  web3Instance?: Web3,
): Promise<Provider> => {
  const provider = new Provider(proxy)
  const web3 = web3Instance?.initiated ? web3Instance : await new Web3().init()

  const injected = web3.getProvider(proxy.providerType)

  if (!injected) throw new errors.ProviderInjectedInstanceNotFoundError()

  return provider.init(injected)
}

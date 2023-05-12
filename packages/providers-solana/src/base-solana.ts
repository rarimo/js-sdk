import {
  errors,
  ProviderEventBus,
  ProviderEventBusEvents,
  ProviderEvents,
  ProviderProxy,
  RawProvider,
  SolanaProvider,
  SolanaTransactionResponse,
  TransactionRequestBody,
  TransactionResponse,
} from '@rarimo/provider'
import {
  Chain,
  ChainId,
  ChainNames,
  ChainTypes,
  SOLANA_CHAIN_IDS,
} from '@rarimo/shared'
import { PublicKey } from '@solana/web3.js'

import {
  getSolExplorerAddressUrl,
  getSolExplorerTxUrl,
  handleSolError,
} from '@/helpers'
import type { SolanaProviderRpcError } from '@/types'

const getAddress = (publicKey: PublicKey | null): string => {
  return publicKey ? new PublicKey(publicKey).toBase58() : ''
}

export class BaseSolanaProvider
  extends ProviderEventBus
  implements ProviderProxy
{
  readonly #provider: SolanaProvider
  #chainId?: ChainId
  #address?: string

  constructor(provider?: RawProvider) {
    if (!provider) throw new errors.ProviderInjectedInstanceNotFoundError()
    super()
    this.#provider = provider as SolanaProvider
  }

  get chainType(): ChainTypes {
    return ChainTypes.Solana
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

  get provider(): SolanaProvider {
    return this.#provider
  }

  async init(): Promise<void> {
    this.#setListeners()
    this.#address = getAddress(this.#provider.publicKey)
    this.#chainId = SOLANA_CHAIN_IDS[ChainNames.SolanaMainNet]
    this.#emitEvent(ProviderEventBusEvents.Initiated)
  }

  async switchChain(chainId: ChainId) {
    try {
      this.#chainId = chainId
      this.#emitEvent(ProviderEventBusEvents.ChainChanged)
    } catch (error) {
      handleSolError(error as SolanaProviderRpcError)
    }
  }

  async connect(): Promise<void> {
    try {
      await this.#provider.connect()
    } catch (error) {
      handleSolError(error as SolanaProviderRpcError)
    }
  }

  getAddressUrl(chain: Chain, address: string): string {
    return getSolExplorerAddressUrl(chain, address)
  }

  getTxUrl(chain: Chain, txHash: string): string {
    return getSolExplorerTxUrl(chain, txHash)
  }

  getHashFromTx(txResponse: TransactionResponse): string {
    return txResponse as SolanaTransactionResponse
  }

  async signAndSendTx(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    txRequestBody: TransactionRequestBody,
  ): Promise<TransactionResponse> {
    throw new TypeError('Method should be implemented in extender class')
  }

  #setListeners() {
    this.#provider.on(ProviderEvents.Connect, () => {
      this.#address = getAddress(this.#provider.publicKey)
      this.#emitEvent(ProviderEventBusEvents.Connect)
    })

    this.#provider.on(ProviderEvents.Disconnect, () => {
      this.#address = getAddress(this.#provider.publicKey)
      this.#emitEvent(ProviderEventBusEvents.Disconnect)
    })

    this.#provider.on(ProviderEvents.AccountChanged, () => {
      this.#address = getAddress(this.#provider.publicKey)
      this.#emitEvent(ProviderEventBusEvents.AccountChanged)
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

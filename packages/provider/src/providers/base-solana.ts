import { ProviderEventBus } from './event-bus'
import {
  Chain,
  ChainId,
  EthProviderRpcError,
  ProviderProxy,
  RawProvider,
  SolanaProvider,
  SolanaProviderRpcError,
  SolanaTransactionResponse,
  TransactionResponse,
  TxRequestBody,
} from '../types'
import Web3 from 'web3'
import { HttpProvider } from 'web3-core'
import { ChainTypes, ProviderEvents, SolanaChains } from '../enums'
import {
  getSolExplorerAddressUrl,
  getSolExplorerTxUrl,
  handleEthError,
  handleSolError,
} from '../helpers'
import { PublicKey } from '@solana/web3.js'

const getAddress = (publicKey: PublicKey | null): string => {
  return publicKey ? new PublicKey(publicKey).toBase58() : ''
}

export class BaseSolanaProvider
  extends ProviderEventBus
  implements ProviderProxy
{
  readonly #provider: SolanaProvider
  #web3: Web3
  #chainId?: ChainId
  #address?: string

  constructor(provider: RawProvider) {
    super()
    this.#web3 = new window.Web3(provider as unknown as HttpProvider)
    this.#provider = (<unknown>this.#web3?.currentProvider) as SolanaProvider
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
    this.#chainId = SolanaChains.devnet

    this.emitInitiated({
      chainId: this.#chainId,
      address: this.#address,
      isConnected: this.isConnected,
    })
  }

  async switchChain(chainId: ChainId) {
    try {
      this.#chainId = chainId
      this.emitChainChanged({ chainId })
    } catch (error) {
      handleSolError(error as SolanaProviderRpcError)
    }
  }

  async connect(): Promise<void> {
    try {
      await this.#provider.connect()
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
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
    txRequestBody: TxRequestBody,
  ): Promise<TransactionResponse> {
    throw new TypeError('Method should be implemented in extender class')
  }

  #setListeners() {
    this.#provider.on(ProviderEvents.Connect, () => {
      this.#address = getAddress(this.#provider.publicKey)

      this.emitConnect({
        address: this.#address,
        isConnected: this.isConnected,
      })
    })

    this.#provider.on(ProviderEvents.Disconnect, () => {
      this.#address = getAddress(this.#provider.publicKey)

      this.emitDisconnect({
        address: this.#address,
        isConnected: this.isConnected,
      })
    })

    this.#provider.on(ProviderEvents.AccountChanged, () => {
      this.#address = getAddress(this.#provider.publicKey)

      this.emitAccountChanged({
        address: this.#address,
        isConnected: this.isConnected,
      })
    })
  }
}

import {
  Address,
  BridgeChain,
  Decimals,
  EVMSwapContractVersion,
  TokenSymbol,
} from '@rarimo/shared'
import type { TokenInfo } from '@uniswap/token-lists'

import { toLow } from '@/helpers'
import type { CreateTokenOpts } from '@/types'

export class Token {
  readonly #chain: BridgeChain
  readonly #address: Address
  readonly #name: string
  readonly #symbol: TokenSymbol
  readonly #decimals: Decimals
  readonly #logoURI?: string

  constructor({
    chain,
    address,
    name,
    symbol,
    decimals,
    logoURI,
  }: CreateTokenOpts) {
    this.#chain = chain
    this.#address = address
    this.#name = name
    this.#symbol = symbol
    this.#decimals = decimals
    this.#logoURI = logoURI
  }

  public get chain(): BridgeChain {
    return this.#chain
  }

  public get address(): Address {
    return this.#address
  }

  public get name(): string {
    return this.#name
  }

  public get symbol(): TokenSymbol {
    return this.#symbol
  }

  public get decimals(): Decimals {
    return this.#decimals
  }

  public get logoURI(): string {
    return this.#logoURI ?? ''
  }

  public get isNative(): boolean {
    return toLow(this.#chain.token.symbol) === toLow(this.#symbol)
  }

  public get isTraderJoe(): boolean {
    return this.#chain.contractVersion === EVMSwapContractVersion.TraderJoe
  }

  public get isQuickSwap(): boolean {
    return this.#chain.contractVersion === EVMSwapContractVersion.QuickSwap
  }

  public get isPancakeSwap(): boolean {
    return this.#chain.contractVersion === EVMSwapContractVersion.PancakeSwap
  }

  public get isUniswapV3(): boolean {
    return this.#chain.contractVersion === EVMSwapContractVersion.UniswapV3
  }

  public get isV2(): boolean {
    return this.isQuickSwap || this.isPancakeSwap || this.isTraderJoe
  }

  public isSame(token: Token): boolean {
    return Boolean(
      this.#chain.id === token.chain.id &&
        toLow(this.#symbol) === toLow(token.symbol) &&
        toLow(this.#address) === toLow(token.address) &&
        this.#decimals === token.decimals,
    )
  }

  static fromTokenInfo(token: TokenInfo, chain: BridgeChain): Token {
    return new Token({
      chain,
      address: token.address,
      name: token.name,
      symbol: token.symbol,
      decimals: token.decimals,
      logoURI: token.logoURI,
    })
  }

  static fromChain(chain: BridgeChain): Token {
    return new Token({
      chain,
      address: '',
      name: chain.token.name,
      symbol: chain.token.symbol,
      decimals: chain.token.decimals,
      logoURI: chain.icon,
    })
  }
}

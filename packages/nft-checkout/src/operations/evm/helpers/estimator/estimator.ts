import {
  BridgeChain,
  EstimatedPrice,
  PaymentToken,
  Target,
  Token,
} from '../../../../types'
import { errors } from '../../../../errors'
import { IProvider } from '@rarimo/provider'
import { estimateUniswapV3 } from './uniswap-v3'
import { estimateJoeTrader } from './joe-trader'
import { estimatePancakeSwap } from './pancake-swap'
import { isPancakeSwap, isTraderJoe } from '../chain'

export class Estimator {
  readonly #target: Target
  readonly #tokens: Token[]
  readonly #chains: BridgeChain[]
  readonly #from: PaymentToken
  readonly #provider: IProvider

  constructor(
    provider: IProvider,
    tokens: Token[],
    chains: BridgeChain[],
    from: PaymentToken,
    target: Target,
  ) {
    this.#tokens = tokens
    this.#chains = chains
    this.#from = from
    this.#target = target
    this.#provider = provider
  }

  async estimate(): Promise<EstimatedPrice> {
    const targetToken = this.#getTargetToken()

    this.#checkTokens(this.#from.token.address, targetToken?.address)

    if (isTraderJoe(this.#from.chain)) {
      return estimateJoeTrader(
        this.#tokens,
        this.#chains,
        this.#provider,
        this.#from.token,
        targetToken!,
        this.#target,
      )
    }

    if (isPancakeSwap(this.#from.chain)) {
      return estimatePancakeSwap(
        this.#tokens,
        this.#chains,
        this.#provider,
        this.#from.token,
        targetToken!,
        this.#target,
      )
    }

    return estimateUniswapV3(
      this.#tokens,
      this.#chains,
      this.#provider,
      this.#from.token,
      targetToken!,
      this.#target,
    )
  }

  #checkTokens(from?: string, to?: string) {
    if (!to || toLow(from) === toLow(to)) {
      throw new errors.OperationInvalidSelectedTokenPairError()
    }
  }

  #getTargetToken() {
    const chain = this.#chains.find(c => c.id === this.#target.chainId)!

    const isNative =
      toLow(chain.token.symbol) === toLow(this.#target.swapTargetTokenSymbol)

    return isNative
      ? { chain, logoURI: chain.icon, address: '', ...chain.token }
      : this.#tokens.find(t => t.symbol === this.#target.swapTargetTokenSymbol)
  }
}

function toLow(str?: string): string {
  return str?.toLowerCase() ?? ''
}

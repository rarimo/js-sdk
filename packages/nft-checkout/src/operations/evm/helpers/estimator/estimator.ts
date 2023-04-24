import type { IProvider } from '@rarimo/provider'

import type { PaymentToken, Token } from '@/entities'
import { errors } from '@/errors'
import { toLow } from '@/helpers'
import type { EstimatedPrice, Target } from '@/types'

import { estimateTraderJoe } from './joe-trader'
import { estimatePancakeSwap } from './pancake-swap'
import { estimateQuickSwap } from './quick-swap'
import { estimateUniswapV3 } from './uniswap-v3'

export class Estimator {
  readonly #target: Target
  readonly #tokens: Token[]
  readonly #from: PaymentToken
  readonly #provider: IProvider

  constructor(
    provider: IProvider,
    tokens: Token[],
    from: PaymentToken,
    target: Target,
  ) {
    this.#tokens = tokens
    this.#from = from
    this.#target = target
    this.#provider = provider
  }

  async estimate(): Promise<EstimatedPrice> {
    const targetToken = this.#getTargetToken()

    this.#checkTokens(this.#from.address, targetToken?.address)

    if (this.#from.isTraderJoe) {
      return estimateTraderJoe(
        this.#tokens,
        this.#provider,
        this.#from,
        targetToken!,
        this.#target,
      )
    }

    if (this.#from.isPancakeSwap) {
      return estimatePancakeSwap(
        this.#tokens,
        this.#provider,
        this.#from,
        targetToken!,
        this.#target,
      )
    }

    if (this.#from.isQuickSwap) {
      return estimateQuickSwap(
        this.#tokens,
        this.#provider,
        this.#from,
        targetToken!,
        this.#target,
      )
    }

    return estimateUniswapV3(
      this.#tokens,
      this.#provider,
      this.#from,
      targetToken!,
      this.#target,
    )
  }

  #checkTokens(from?: string, to?: string) {
    if (toLow(from) === toLow(to)) {
      throw new errors.OperationInvalidSelectedTokenPairError()
    }
  }

  #getTargetToken() {
    return this.#tokens.find(
      t => toLow(t.symbol) === toLow(this.#target.swapTargetTokenSymbol),
    )
  }
}

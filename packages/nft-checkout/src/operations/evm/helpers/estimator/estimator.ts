import { EstimatedPrice, Target } from '../../../../types'
import { errors } from '../../../../errors'
import { IProvider } from '@rarimo/provider'
import { estimateUniswapV3 } from './uniswap-v3'
import { estimateJoeTrader } from './joe-trader'
import { estimatePancakeSwap } from './pancake-swap'
import { toLow } from '../../../../helpers'
import { PaymentToken, Token } from '../../../../entities'

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
      return estimateJoeTrader(
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

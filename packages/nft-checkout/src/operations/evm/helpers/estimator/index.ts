import { EstimatedPrice, PaymentToken, Target, Token } from '@/types'
import { IProvider } from '@rarimo/provider'
import { errors } from '@/errors'
import { estimateUniswapV3 } from './uniswap-v3'
import { estimateJoeTrader } from './joe-trader'
import { estimatePancakeSwap } from './pancake-swap'
import { isPancakeSwap, isTraderJoe } from '../chain'

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
    this.#checkTokens(this.#from.token.address, targetToken?.address)

    if (isTraderJoe(this.#from.chain)) {
      return estimateJoeTrader(
        this.#provider,
        this.#from.token,
        targetToken!,
        this.#target,
      )
    }

    if (isPancakeSwap(this.#from.chain)) {
      return estimatePancakeSwap(
        this.#provider,
        this.#from.token,
        targetToken!,
        this.#target,
      )
    }

    return estimateUniswapV3(
      this.#provider,
      this.#from.token,
      targetToken!,
      this.#target,
    )
  }

  #checkTokens(from?: string, to?: string) {
    if (!from || !to || from?.toLowerCase() === to?.toLowerCase()) {
      throw new errors.OperationInvalidSelectedTokenPairError()
    }
  }

  #getTargetToken() {
    return this.#tokens.find(
      t => t.symbol === this.#target.swapTargetTokenSymbol,
    )
  }
}

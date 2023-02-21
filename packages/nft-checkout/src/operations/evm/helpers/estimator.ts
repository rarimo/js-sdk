import { EstimatedPrice, PaymentToken, Target, Token } from '@/types'
import { ChainTypes, errors, IProvider } from '@rarimo/provider'
import { CHAIN_IDS } from '@/const'
import { ChainNames } from '@/enums'
import { estimateUniswapV3 } from './estimate-uniswap-v3'
import { estimateAvalancheV2 } from './estimate-avalanche-v2'
import { isV2, TARGET_TOKEN_SYMBOLS } from './chain'

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
    const targetToken = this.#getTargetTokenSymbol()

    this.#checkTokens(this.#from.token.address, targetToken?.address)

    return isV2(this.#from.chain)
      ? estimateAvalancheV2(
          this.#provider,
          this.#from.token,
          targetToken!,
          this.#target,
        )
      : estimateUniswapV3(
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

  #getTargetTokenSymbol() {
    const chains = CHAIN_IDS[ChainTypes.EVM]
    let symbol = ''

    const fromChainId = Number(this.#from.chain.id)
    const toChainId = Number(this.#target.chainId)

    // TODO: do something with this please
    // For the Avalanche Wrapped ethereum symbol is WETH.e.
    // WETH is a symbol for Wormhole ethereum which has low liquidity
    if (
      fromChainId === chains[ChainNames.Avalanche] &&
      toChainId === chains[ChainNames.Ethereum]
    ) {
      symbol = 'WETH.e'
    }

    symbol = TARGET_TOKEN_SYMBOLS[toChainId] ?? ''

    return this.#tokens.find(t => t.symbol === symbol)
  }
}

import { EstimatedPrice, PaymentToken, Target, Token } from '@/types'
import { ChainTypes, errors } from '@rarimo/provider'
import { CHAIN_IDS } from '@/const'
import { ChainNames } from '@/enums'
import { JsonRpcProvider } from '@ethersproject/providers'
import { estimateUniswap } from './estimate-uniswap'
import { estimateTraderJoe } from './estimate-trader-joe'
import { isAvalanche, isEthereum } from './chain'

export class Estimator {
  readonly #rpc: JsonRpcProvider
  readonly #target: Target
  readonly #tokens: Token[]
  readonly #from: PaymentToken
  readonly #walletAddress: string

  constructor(
    rpc: JsonRpcProvider,
    tokens: Token[],
    from: PaymentToken,
    target: Target,
    walletAddress: string,
  ) {
    this.#rpc = rpc
    this.#tokens = tokens
    this.#from = from
    this.#target = target
    this.#walletAddress = walletAddress
  }

  async estimate(): Promise<EstimatedPrice> {
    const chainId = Number(this.#from.chain.id)
    const targetToken = this.#getTargetToken()

    this.#checkTokens(this.#from.token.address, targetToken?.address)

    if (isEthereum(chainId)) {
      return estimateUniswap(
        this.#rpc,
        this.#from.token,
        targetToken!,
        this.#target,
        this.#walletAddress,
      )
    }

    if (isAvalanche(chainId)) {
      return estimateTraderJoe(
        this.#rpc,
        this.#from.token,
        targetToken!,
        this.#target,
      )
    }

    throw new errors.OperationInvalidChainPairError()
  }

  #checkTokens(from?: string, to?: string) {
    if (!from || !to || from?.toLowerCase() === to?.toLowerCase()) {
      throw new errors.OperationInvalidSelectedTokenPairError()
    }
  }

  #getTargetToken() {
    const chains = CHAIN_IDS[ChainTypes.EVM]
    let symbol = ''

    const chainId = this.#from.chain.id

    // FIXME: integrate with backend
    // For the Avalanche Wrapped ethereum symbol is WETH.e.
    // WETH is a symbol for Wormhole ethereum which has low liquidity
    if (
      chainId === chains[ChainNames.Avalanche] &&
      chainId === chains[ChainNames.Ethereum]
    ) {
      symbol = 'WETH.e'
    }

    symbol =
      {
        [chains[ChainNames.Ethereum]]: 'WETH',
        [chains[ChainNames.Polygon]]: 'WMATIC',
        [chains[ChainNames.Avalanche]]: 'WAVAX',
        [chains[ChainNames.Goerli]]: 'WETH',
        [chains[ChainNames.Sepolia]]: 'WETH',
        [chains[ChainNames.Fuji]]: 'WAVAX',
      }[chainId] ?? ''

    return this.#tokens.find(t => t.symbol === symbol)
  }
}

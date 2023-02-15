import { EstimatedPrice, PaymentToken, Target, Token } from '@/types'
import { ChainTypes, errors } from '@rarimo/provider'
import { CHAIN_IDS } from '@/const'
import { ChainNames } from '@/enums'
import { JsonRpcProvider } from '@ethersproject/providers'
import { estimateV3 } from './estimate-v3'
import { estimateV2 } from './estimate-v2'
import { isV2 } from './chain'

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
    const targetToken = this.#getTargetTokenSymbol()

    this.#checkTokens(this.#from.token.address, targetToken?.address)

    return isV2(this.#from.chain)
      ? estimateV2(this.#rpc, this.#from.token, targetToken!, this.#target)
      : estimateV3(
          this.#rpc,
          this.#from.token,
          targetToken!,
          this.#target,
          this.#walletAddress,
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

    symbol =
      {
        [chains[ChainNames.Ethereum]]: 'WETH',
        [chains[ChainNames.Polygon]]: 'WMATIC',
        [chains[ChainNames.Avalanche]]: 'WAVAX',
        [chains[ChainNames.Goerli]]: 'WETH',
        [chains[ChainNames.Sepolia]]: 'WETH',
        [chains[ChainNames.Fuji]]: 'WAVAX',
      }[toChainId] ?? ''

    return this.#tokens.find(t => t.symbol === symbol)
  }
}

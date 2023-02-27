import {
  BridgeChain,
  Config,
  EstimatedPrice,
  INFTCheckoutOperation,
  OperationCreateParams,
  PaymentToken,
  Target,
  Token,
  TxBundle,
} from '../../types'
import {
  ChainId,
  ChainTypes,
  errors as providerErrors,
  IProvider,
  TransactionResponse,
} from '@rarimo/provider'
import {
  Estimator,
  getPaymentTokens,
  isNativeToken,
  getSwapAmount,
  isPancakeSwap,
  isTraderJoe,
  loadTokens,
} from './helpers'
import {
  BUNDLE_SALT_BYTES,
  CHAINS,
  ERC20_ABI,
  SWAP_V2_ABI,
  SWAP_V3_ABI,
} from '../../const'
import { errors } from '../../errors'

import { Contract, utils } from 'ethers'
import { BN } from '@distributedlab/utils'
import { SwapContractVersion } from '../../enums'

const SWAP_CONTRACT_ABIS = {
  [SwapContractVersion.TraderJoe]: SWAP_V2_ABI,
  [SwapContractVersion.PancakeSwap]: SWAP_V2_ABI,
  [SwapContractVersion.UniswapV3]: SWAP_V3_ABI,
}

export class EVMOperation implements INFTCheckoutOperation {
  readonly #provider: IProvider
  readonly #config: Config

  #initialized = false

  #chainFrom: BridgeChain
  #target?: Target

  #chains: BridgeChain[]
  #tokens: Token[] = []

  constructor(config: Config, provider: IProvider) {
    this.#config = config
    this.#provider = provider
  }

  public get chain(): BridgeChain {
    return this.#chainFrom
  }

  public get provider(): IProvider {
    return this.#provider
  }

  public get initialized(): boolean {
    return this.#initialized
  }

  async init({ chainIdFrom, target }: OperationCreateParams): Promise<void> {
    if (!this.#chains.length) {
      await this.supportedChains()
    }

    const from = this.#getChainByID(chainIdFrom)
    const to = this.#getChainByID(target.chainId)

    if (!from || !to) {
      throw new errors.OperationInvalidChainPairError()
    }

    this.#chainFrom = from
    this.#target = target

    if (this.#provider.chainType !== ChainTypes.EVM) {
      throw new errors.OperationInvalidProviderChainTypeError()
    }

    this.#initialized = true
  }

  public async supportedChains(): Promise<BridgeChain[]> {
    // TODO: add backend integration
    this.#chains = CHAINS[ChainTypes.EVM]!

    return this.#chains
  }

  public async supportedTokens(): Promise<Token[]> {
    if (!this.initialized) throw new errors.OperatorNotInitializedError()

    return this.#tokens
  }

  public async loadPaymentTokens(chain: BridgeChain): Promise<PaymentToken[]> {
    if (!this.initialized) throw new errors.OperatorNotInitializedError()

    if (!this.#provider.isConnected) {
      await this.#provider.connect()
    }

    if (this.#provider.chainId != chain.id) {
      await this.#switchChain()
    }

    return getPaymentTokens(
      this.#chainFrom!,
      this.#provider,
      await this.#loadTokens(),
    )
  }

  public async estimatePrice(from: PaymentToken): Promise<EstimatedPrice> {
    if (!this.initialized) throw new errors.OperatorNotInitializedError()

    return new Estimator(
      this.#provider,
      this.#tokens,
      this.#chains,
      from,
      this.#target!,
    ).estimate()
  }

  public async checkout(
    e: EstimatedPrice,
    bundle: TxBundle,
  ): Promise<TransactionResponse> {
    const chain = e.from.chain
    await this.#sendApproveTxIfNeeded(String(chain.contractAddress), e)

    return this.#provider.signAndSendTx({
      from: this.#provider.address,
      to: chain.contractAddress,
      data: this.#encodeTxData(e, bundle),
      ...(isNativeToken(this.#chains, e.from)
        ? {
            value: new BN(
              new BN(e.price.toString()).mul(1.02).round(e.price.decimals),
            )
              .toFraction(e.price.decimals)
              .toString(),
          }
        : {}),
    })
  }

  #encodeTxData(e: EstimatedPrice, bundle: TxBundle): string {
    const chain = e.from.chain
    const isV2NativeToken =
      (isTraderJoe(chain) || isPancakeSwap(chain)) &&
      isNativeToken(this.#chains, e.from)

    const functionFragment = isV2NativeToken
      ? 'swapExactNativeInputMultiHopThenBridge'
      : 'swapExactOutputMultiHopThenBridge'

    const amountOut = getSwapAmount(this.#target!.price)
    const amountInMax = e.price.value
    const receiverAddress = this.#provider.address

    const networkName = this.#chains.find(
      i => Number(i.id) === Number(this.#target?.chainId),
    )
    const bundleTuple = [
      bundle.salt || utils.hexlify(utils.randomBytes(BUNDLE_SALT_BYTES)),
      bundle.bundle,
    ]

    return new utils.Interface(
      SWAP_CONTRACT_ABIS[chain.contactVersion],
    ).encodeFunctionData(functionFragment, [
      amountOut,
      ...(isV2NativeToken ? [] : [amountInMax]),
      e.path,
      receiverAddress,
      networkName,
      true,
      bundleTuple,
    ])
  }

  async #sendApproveTxIfNeeded(routerAddress: string, e: EstimatedPrice) {
    if (isNativeToken(this.#chains, e.from)) return

    const contract = new Contract(
      e.from.address,
      ERC20_ABI,
      this.#provider?.getWeb3Provider?.(),
    )

    const allowanceRaw = await contract.allowance(
      this.#provider.address,
      routerAddress,
    )

    if (!e.price.value) {
      throw new errors.OperationEstimatedPriceNotExistError()
    }

    const allowance = new BN(allowanceRaw.toString()).fromFraction(
      e.from.decimals,
    )

    const estimationPrice = new BN(e.price.value).fromFraction(e.from.decimals)

    if (estimationPrice.compare(allowance) == -1) {
      return
    }

    const data = new utils.Interface(ERC20_ABI).encodeFunctionData('approve', [
      routerAddress,
      BN.MAX_UINT256.toString(),
    ])

    return this.#provider.signAndSendTx({
      from: this.#provider.address,
      to: e.from.address,
      data,
    })
  }

  #getChainByID(id: ChainId) {
    return this.#chains.find(chain => chain.id === id)
  }

  async #loadTokens() {
    if (!this.initialized) return []

    this.#tokens = await loadTokens(this.#config, this.#chainFrom)

    return this.#tokens
  }

  async #switchChain() {
    if (!this.initialized) throw new errors.OperatorNotInitializedError()

    try {
      await this.#provider.switchChain(this.#chainFrom!.id)
    } catch (e) {
      if (!(e instanceof providerErrors.ProviderChainNotFoundError)) {
        throw e
      }
      await this.#provider.addChain!(this.#chainFrom!)
      await this.#switchChain()
    }
  }
}

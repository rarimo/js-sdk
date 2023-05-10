import { BN } from '@distributedlab/tools'
import type { Bridger, DestinationTransaction } from '@rarimo/bridge'
import type { Token } from '@rarimo/bridge'
import { createBridger, createEVMBridger } from '@rarimo/bridge'
import { errors as providerErrors, IProvider } from '@rarimo/provider'
import {
  BridgeChain,
  BUNDLE_SALT_BYTES,
  ChainId,
  ChainTypes,
  NATIVE_TOKEN_WRAP_SLIPPAGE_MULTIPLIER,
  TxBundle,
} from '@rarimo/shared'
import { Contract, providers, utils } from 'ethers'

import { ERC20_ABI, SWAP_CONTRACT_ABIS } from '@/const'
import type { Price } from '@/entities'
import { errors } from '@/errors'
import { toLow } from '@/helpers'
import type {
  Config,
  EstimatedPrice,
  INFTCheckoutOperation,
  OperationCreateParams,
  PaymentToken,
  Target,
} from '@/types'

import { OperationEventBus } from '../event-bus'
import {
  estimate,
  getPaymentTokens,
  getSwapAmount,
  loadTokens,
} from './helpers'

// We always use liquidity pool and not control those token contracts
// In case when `isWrapped: false`, bridge contract won't try to burn tokens
const IS_TOKEN_WRAPPED = false

/**
 * An operation on an EVM chain.
 *
 * @example
 * ```js
 * const provider = await createProvider(MetamaskProvider)
 * const op = createCheckoutOperation(EVMOperation, provider)
 * ```
 */
export class EVMOperation
  extends OperationEventBus
  implements INFTCheckoutOperation
{
  readonly #provider: IProvider
  readonly #config: Config

  #isInitialized = false

  #chainFrom?: BridgeChain
  #target?: Target

  #tokens: Token[] = []
  #bridger: Bridger

  constructor(config: Config, provider: IProvider) {
    super()
    this.#config = config
    this.#provider = provider
    this.#bridger = createBridger(createEVMBridger, provider)
  }

  public get chainFrom(): BridgeChain | undefined {
    return this.#chainFrom
  }

  public get provider(): IProvider {
    return this.#provider
  }

  public get isInitialized(): boolean {
    return this.#isInitialized
  }

  public get target() {
    return this.#target
  }

  /**
   * Initialize the operation with the source chain and transaction parameters
   * @param param0 Information about the source chain and the target transaction of the operation
   */
  async init({ chainIdFrom, target }: OperationCreateParams): Promise<void> {
    await this.#bridger.init()

    const from = this.#getChainByID(chainIdFrom)
    const to = this.#getChainByID(target.chainId)

    if (!from || !to) {
      throw new errors.OperationInvalidChainPairError()
    }

    if (toLow(target.swapTargetTokenSymbol) === toLow(from.token.symbol)) {
      throw new errors.OperationSwapIntoNativeNotSupported()
    }

    this.#chainFrom = from
    this.#target = target

    if (this.#provider.chainType !== ChainTypes.EVM) {
      throw new errors.OperationInvalidProviderChainTypeError()
    }

    this.#isInitialized = true

    this.emitInitiated({
      isInitiated: this.#isInitialized,
      chainFrom: this.#chainFrom,
      target: this.#target,
    })
  }

  /**
   * Get the chains that are supported for the operation type
   *
   * @returns A list of supported chains and information about them
   */
  public async supportedChains(): Promise<BridgeChain[]> {
    return this.#bridger.loadSupportedChains()
  }

  public async supportedTokens(chain?: BridgeChain): Promise<Token[]> {
    if (!this.isInitialized) throw new errors.OperatorNotInitializedError()
    if (!this.#provider.isConnected) {
      await this.#provider.connect()
    }

    const targetChain = chain ? chain : this.chainFrom
    if (this.#provider.chainId != targetChain?.id) {
      await this.#switchChain(targetChain)
    }
    return await this.#loadTokens()
  }

  /**
   * Load the wallet's balance of payment tokens on the specified chain.
   *
   * @param chain A chain from {@link supportedChains}
   * @returns An array of tokens and the wallet's balance of each token
   */
  public async loadPaymentTokens(chain?: BridgeChain): Promise<PaymentToken[]> {
    if (!this.isInitialized) throw new errors.OperatorNotInitializedError()

    if (!this.#provider.isConnected) {
      await this.#provider.connect()
    }
    if (this.#provider.chainId != chain?.id) {
      await this.#switchChain(chain)
    }

    return getPaymentTokens(
      this.#chainFrom!,
      this.#provider,
      await this.#loadTokens(),
    )
  }

  /**
   * Get the estimated purchase price in the payment token, including the cost to swap the tokens to the tokens that the seller accepts payment in
   *
   * @param from The token to use for the transaction
   * @returns Information about the costs involved in the transaction, including the gas price
   */
  public async estimatePrice(from: PaymentToken) {
    if (!this.isInitialized) throw new errors.OperatorNotInitializedError()

    return estimate(this.#provider, this.#tokens, from, this.#target!)
  }

  /**
   * Send a transaction to Rarimo for processing
   *
   * @param e The estimated price of the transaction, from {@link estimatePrice}
   * @param bundle The transaction bundle
   * @returns The hash of the transaction
   */
  public async checkout(e: EstimatedPrice, bundle?: TxBundle): Promise<string> {
    const chain = e.from.chain
    await this.#sendApproveTxIfNeeded(String(chain.contractAddress), e)

    if (!chain.contractAddress) {
      throw new errors.OperationChainNotSupportedError()
    }

    const result = await this.#provider.signAndSendTx({
      from: this.#provider.address,
      to: chain.contractAddress,
      data: this.#encodeTxData(e, bundle),
      ...(e.from.isNative
        ? {
            value: this.#getNativeAmountIn(e.price),
          }
        : {}),
    })

    return typeof result === 'string'
      ? result
      : (result as providers.TransactionReceipt)?.transactionHash
  }

  public async getDestinationTx(
    sourceChain: BridgeChain,
    sourceTxHash: string,
  ): Promise<DestinationTransaction> {
    return this.#bridger.getDestinationTx(sourceChain, sourceTxHash)
  }

  #getNativeAmountIn(price: Price) {
    return BN.fromBigInt(price.value, price.decimals).mul(
      BN.fromRaw(NATIVE_TOKEN_WRAP_SLIPPAGE_MULTIPLIER, price.decimals),
    ).value
  }

  #getFunctionFragment(from: Token, to: Token) {
    if (from.isNative && to.isNative) {
      throw new errors.OperationInvalidTokenPairError()
    }

    if (from.isNative && from.isV2) {
      return 'swapExactNativeInputMultiHopThenBridge'
    }

    if (from.isNative) {
      return 'swapExactInputMultiHopThenBridge'
    }

    if (to.isNative && from.isV2) {
      return 'swapNativeExactOutputMultiHopThenBridge'
    }

    return 'swapExactOutputMultiHopThenBridge'
  }

  #getAmounts(from: Token, to: Token, e: EstimatedPrice): string[] {
    const amountOutMinimum = getSwapAmount(this.#target!.price)
    const amountIn = this.#getNativeAmountIn(e.price)

    if ((from.isNative || to.isNative) && from.isV2) {
      return [amountOutMinimum]
    }

    if (from.isNative) {
      return [amountIn, amountOutMinimum]
    }

    return [amountOutMinimum, e.price.value]
  }

  #encodeTxData(e: EstimatedPrice, bundle?: TxBundle): string {
    const chain = e.from.chain
    const functionFragment = this.#getFunctionFragment(e.from, e.to)
    const receiverAddress = this.#target?.recipient ?? this.#provider.address
    const amounts = this.#getAmounts(e.from, e.to, e)

    const network = this.#bridger.chains.find(
      i => Number(i.id) === Number(this.#target?.chainId),
    )

    const bundleTuple = [
      bundle?.salt || utils.hexlify(utils.randomBytes(BUNDLE_SALT_BYTES)),
      bundle?.bundle ?? '',
    ]

    return new utils.Interface(
      SWAP_CONTRACT_ABIS[chain.contractVersion],
    ).encodeFunctionData(functionFragment, [
      ...amounts,
      e.path,
      receiverAddress,
      network?.name ?? '',
      IS_TOKEN_WRAPPED,
      bundleTuple,
    ])
  }

  async #sendApproveTxIfNeeded(routerAddress: string, e: EstimatedPrice) {
    if (e.from.isNative) return

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

    const allowance = BN.fromBigInt(allowanceRaw.toString(), e.from.decimals)
    const estimationPrice = BN.fromBigInt(e.price.value, e.price.decimals)

    if (estimationPrice.isLessThan(allowance)) {
      return
    }

    const data = new utils.Interface(ERC20_ABI).encodeFunctionData('approve', [
      routerAddress,
      BN.MAX_UINT256.value,
    ])

    return this.#provider.signAndSendTx({
      from: this.#provider.address,
      to: e.from.address,
      data,
    })
  }

  #getChainByID(id: ChainId) {
    return this.#bridger.chains.find(chain => chain.id === id)
  }

  async #loadTokens() {
    if (!this.isInitialized) return []
    this.#tokens = await loadTokens(this.#config, this.#chainFrom!)
    return this.#tokens
  }

  async #switchChain(chain?: BridgeChain) {
    if (!this.isInitialized) throw new errors.OperatorNotInitializedError()

    const targetChain = chain ?? this.#chainFrom
    try {
      await this.#provider.switchChain(targetChain!.id)
    } catch (e) {
      if (!(e instanceof providerErrors.ProviderChainNotFoundError)) {
        throw e
      }
      await this.#provider.addChain!(targetChain!)
      await this.#switchChain(targetChain)
    }
  }
}

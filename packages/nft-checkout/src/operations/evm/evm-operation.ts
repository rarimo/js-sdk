import { BN } from '@distributedlab/tools'
import type { Token } from '@rarimo/bridge'
import {
  DestinationTransaction,
  DestinationTransactionStatus,
} from '@rarimo/bridge'
import { errors as providerErrors, IProvider } from '@rarimo/provider'
import {
  Amount,
  BridgeChain,
  ChainId,
  ChainTypes,
  isString,
  NATIVE_TOKEN_WRAP_SLIPPAGE_MULTIPLIER,
  toLowerCase as lc,
  TransactionBundle,
} from '@rarimo/shared'
import type { Swapper } from '@rarimo/swap'
import { createEVMSwapper, createSwapper } from '@rarimo/swap'
import type { providers } from 'ethers'

import type { Price } from '@/entities'
import { OperationEventBusEvents } from '@/enums'
import { errors } from '@/errors'
import type {
  Config,
  EstimatedPrice,
  INFTCheckoutOperation,
  OperationCreateParams,
  PaymentToken,
  Target,
} from '@/types'
import { CheckoutOperationStatus } from '@/types'

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
  #status: CheckoutOperationStatus = CheckoutOperationStatus.Created

  #chainFrom?: BridgeChain
  #target?: Target
  #targetToken?: Token

  #tokens: Token[] = []
  #swapper: Swapper

  constructor(config: Config, provider: IProvider) {
    super()
    this.#config = config
    this.#provider = provider
    this.#swapper = createSwapper(createEVMSwapper, provider)
  }

  public get status(): CheckoutOperationStatus {
    return this.#status
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

  async init({ chainIdFrom, target }: OperationCreateParams): Promise<void> {
    this.#setStatus(CheckoutOperationStatus.Initializing)

    await this.#swapper.init()

    const from = this.#getChainByID(chainIdFrom)
    const to = this.#getChainByID(target.chainId)

    if (!from || !to) {
      throw new errors.OperationInvalidChainPairError()
    }

    if (lc(target.swapTargetTokenSymbol) === lc(from.token.symbol)) {
      throw new errors.OperationSwapIntoNativeNotSupported()
    }

    this.#chainFrom = from
    this.#target = target

    if (this.#provider.chainType !== ChainTypes.EVM) {
      throw new errors.OperationInvalidProviderChainTypeError()
    }

    this.#isInitialized = true

    this.#emitEvent(OperationEventBusEvents.Initiated)
    this.#setStatus(CheckoutOperationStatus.Initialized)
  }

  public async supportedChains(): Promise<BridgeChain[]> {
    this.#setStatus(CheckoutOperationStatus.SupportedChainsLoading)

    const chains = this.#swapper.chains.length
      ? this.#swapper.chains
      : await this.#swapper.supportedChains()

    this.#setStatus(CheckoutOperationStatus.SupportedChainsLoaded)

    return chains
  }

  public async supportedTokens(chain?: BridgeChain): Promise<Token[]> {
    if (!this.isInitialized) throw new errors.OperatorNotInitializedError()

    this.#setStatus(CheckoutOperationStatus.SupportedTokensLoading)

    if (!this.#provider.isConnected) {
      await this.#provider.connect()
    }

    const targetChain = chain ? chain : this.chainFrom
    if (this.#provider.chainId != targetChain?.id) {
      await this.#switchChain(targetChain)
    }

    const result = await this.#loadTokens()

    this.#setStatus(CheckoutOperationStatus.SupportedTokensLoaded)

    return result
  }

  public async loadPaymentTokens(chain?: BridgeChain): Promise<PaymentToken[]> {
    if (!this.isInitialized) throw new errors.OperatorNotInitializedError()

    this.#setStatus(CheckoutOperationStatus.PaymentTokensLoading)

    if (!this.#provider.isConnected) {
      await this.#provider.connect()
    }

    if (this.#provider.chainId != chain?.id) {
      await this.#switchChain(chain)
    }

    const result = await getPaymentTokens(
      this.#chainFrom!,
      this.#provider,
      await this.#loadTokens(),
    )

    const withPairs = this.#getPaymentTokensWithPairs(result)

    this.#setStatus(CheckoutOperationStatus.PaymentTokensLoaded)

    return withPairs
  }

  async #getPaymentTokensWithPairs(
    result: PaymentToken[],
  ): Promise<PaymentToken[]> {
    const internalToken = await this.#swapper.getInternalTokenMapping(
      this.#target?.swapTargetTokenSymbol ?? '',
    )

    if (!internalToken) return []

    const chain = internalToken?.chains.find(
      i => lc(i.id) === lc(this.#chainFrom?.name),
    )

    if (!chain) return []

    const targetToken = this.#tokens.find(
      i => lc(i.address) === lc(chain.token_address),
    )

    if (!targetToken) return []

    this.#targetToken = targetToken

    const estimatedPrices = await Promise.allSettled(
      result.map(i =>
        estimate(this.#provider, this.#tokens, i, this.#target!, targetToken),
      ),
    )

    return estimatedPrices.reduce<PaymentToken[]>((acc, i) => {
      if (i.status === 'fulfilled') {
        const paymentToken = result.find(
          t => lc(t.symbol) === lc(i.value.from.symbol),
        )
        if (paymentToken) acc.push(paymentToken)
      }

      return acc
    }, [])
  }

  public async estimatePrice(from: PaymentToken) {
    if (!this.isInitialized) throw new errors.OperatorNotInitializedError()

    this.#setStatus(CheckoutOperationStatus.EstimatedPriceCalculating)

    const price = await estimate(
      this.#provider,
      this.#tokens,
      from,
      this.#target!,
      this.#targetToken!,
    )

    this.#setStatus(CheckoutOperationStatus.EstimatedPriceCalculated)

    return price
  }

  public async checkout(
    e: EstimatedPrice,
    bundle?: TransactionBundle,
  ): Promise<string> {
    if (!e.from.chain.contractAddress) {
      throw new errors.OperationChainNotSupportedError()
    }

    this.#setStatus(CheckoutOperationStatus.CheckoutStarted)

    const chainTo = this.#swapper.chains.find(
      i => Number(i.id) === Number(this.#target?.chainId),
    )

    const price = this.#target!.price
    const amountIn = e.from.isNative ? getNativeAmountIn(e.price) : e.price
    const amountOut = Amount.fromBigInt(getSwapAmount(price), price.decimals)

    await this.#approveIfRequired(e.from, amountIn)

    this.#setStatus(CheckoutOperationStatus.SubmittingCheckoutTx)

    const result = await this.#swapper.execute({
      from: e.from,
      to: e.to,
      amountIn,
      amountOut,
      receiver: this.#target!.recipient,
      path: e.path,
      chainTo,
      bundle,
      isWrapped: IS_TOKEN_WRAPPED,
      handleAllowance: false,
    })

    this.#setStatus(CheckoutOperationStatus.CheckoutCompleted)

    return isString(result)
      ? result
      : (result as providers.TransactionReceipt)?.transactionHash
  }

  public async getDestinationTx(
    sourceChain: BridgeChain,
    sourceTxHash: string,
  ): Promise<DestinationTransaction> {
    this.#setStatus(CheckoutOperationStatus.DestinationTxPending)

    const result = await this.#swapper.getDestinationTx(
      sourceChain,
      sourceTxHash,
    )
    const status =
      result!.status === DestinationTransactionStatus.Success
        ? CheckoutOperationStatus.DestinationTxSuccess
        : CheckoutOperationStatus.DestinationTxFailed

    this.#setStatus(status)

    return result
  }

  async #approveIfRequired(token: Token, amount: Amount) {
    this.#setStatus(CheckoutOperationStatus.CheckAllowance)

    const isApproveRequired = await this.#swapper.isApproveRequired(
      token,
      token.chain.contractAddress,
      amount,
    )

    if (!isApproveRequired) return

    this.#setStatus(CheckoutOperationStatus.Approve)
    await this.#swapper.approve(token, token.chain.contractAddress)
    this.#setStatus(CheckoutOperationStatus.Approved)
  }

  #getChainByID(id: ChainId) {
    return this.#swapper.chains.find(chain => chain.id === id)
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

  #setStatus(status: CheckoutOperationStatus) {
    this.#status = status
    this.#emitEvent(OperationEventBusEvents.StatusChanged)
  }

  #emitEvent(event: OperationEventBusEvents) {
    this.emit(event, {
      isInitiated: this.#isInitialized,
      chainFrom: this.#chainFrom,
      target: this.#target,
      status: this.#status,
    })
  }
}

const getNativeAmountIn = (price: Price) => {
  return Amount.fromBigInt(
    BN.fromBigInt(price.value, price.decimals).mul(
      BN.fromRaw(NATIVE_TOKEN_WRAP_SLIPPAGE_MULTIPLIER, price.decimals),
    ).value,
    price.decimals,
  )
}

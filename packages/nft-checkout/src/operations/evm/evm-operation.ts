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
  toLowerCase as lc,
  TransactionBundle,
} from '@rarimo/shared'
import type { Swapper } from '@rarimo/swap'
import { createEVMSwapper, createSwapper } from '@rarimo/swap'
import type { providers } from 'ethers'

import { OperationEventBusEvents } from '@/enums'
import { errors } from '@/errors'
import type {
  CheckoutOperation,
  CheckoutOperationParams,
  Config,
  EstimatedPrice,
  PaymentToken,
} from '@/types'
import { CheckoutOperationStatus } from '@/types'

import { OperationEventBus } from '../event-bus'
import {
  estimate,
  getNativeAmountIn,
  getPaymentTokens,
  getSwapAmount,
  isSameChainOperation,
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
  implements CheckoutOperation
{
  readonly #provider: IProvider
  readonly #config: Config

  #isInitialized = false
  #status: CheckoutOperationStatus = CheckoutOperationStatus.Created

  #chainFrom?: BridgeChain
  #params?: CheckoutOperationParams
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

  public get params() {
    return this.#params
  }

  async init(params: CheckoutOperationParams): Promise<void> {
    this.#setStatus(CheckoutOperationStatus.Initializing)

    await this.#swapper.init()

    const from = this.#getChainByID(params.chainIdFrom)
    const to = this.#getChainByID(params.chainIdTo)

    if (!from || !to) {
      throw new errors.OperationInvalidChainPairError()
    }

    this.#chainFrom = from
    this.#params = params

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

  public async loadPaymentTokens(chain?: BridgeChain): Promise<PaymentToken[]> {
    if (!this.isInitialized) throw new errors.OperatorNotInitializedError()

    this.#setStatus(CheckoutOperationStatus.PaymentTokensLoading)

    if (!this.#provider.isConnected) {
      await this.#provider.connect()
    }

    if (this.#provider.chainId != chain?.id) {
      await this.#switchChain(chain)
    }

    const withPairs = await this.#getPaymentTokensWithPairs(
      await getPaymentTokens(
        this.#chainFrom!,
        this.#provider,
        await this.#loadTokens(),
      ),
    )

    this.#setStatus(CheckoutOperationStatus.PaymentTokensLoaded)

    return withPairs
  }

  public async estimatePrice(from: PaymentToken) {
    if (!this.isInitialized) throw new errors.OperatorNotInitializedError()

    this.#setStatus(CheckoutOperationStatus.EstimatedPriceCalculating)

    const price = await estimate(
      this.#provider,
      this.#tokens,
      from,
      this.#params!,
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
      i => Number(i.id) === Number(this.#params?.chainIdTo),
    )

    const { amountIn, amountOut } = getAmounts(this.#params!, e)

    if (!e.from.isNative) await this.#approveIfRequired(e.from, amountIn)

    this.#setStatus(CheckoutOperationStatus.SubmittingCheckoutTx)

    const result = await this.#swapper.execute({
      from: e.from,
      to: e.to,
      amountIn,
      amountOut,
      receiver: this.#params!.recipient,
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

  async #getPaymentTokensWithPairs(
    result: PaymentToken[],
  ): Promise<PaymentToken[]> {
    this.#targetToken = await this.#getTargetToken()

    if (!this.#targetToken) return []

    const tokens = result.filter(
      i => lc(i.symbol) !== lc(this.#targetToken?.symbol),
    )

    const estimatedPrices = await Promise.allSettled(
      tokens.map(i =>
        estimate(
          this.#provider,
          this.#tokens,
          i,
          this.#params!,
          this.#targetToken!,
        ),
      ),
    )

    return estimatedPrices.reduce<PaymentToken[]>((acc, i) => {
      if (i.status === 'fulfilled') {
        const paymentToken = result.find(
          t => lc(t.symbol) === lc(i.value.from.symbol),
        )

        if (paymentToken) {
          const amountIn = i.value.from.isNative
            ? getNativeAmountIn(this.#params!, i.value.price)
            : i.value.price

          const isEnoughBalance = amountIn.isLessThanOrEqualTo(
            paymentToken.balanceRaw,
          )

          if (isEnoughBalance) acc.push(paymentToken)
        }
      }

      return acc
    }, [])
  }

  async #getTargetToken(): Promise<Token | undefined> {
    const params = this.#params!
    const isSameChain = isSameChainOperation(params)
    const targetTokenAddress = params.price.address

    // get target token from params if it's the same chain operation,
    // otherwise we will get it from internal mappings
    if (isSameChain && targetTokenAddress) {
      return this.#tokens.find(i => lc(i.address) === lc(targetTokenAddress))
    }

    const internalToken = await this.#swapper.getInternalTokenMapping(
      params.price.symbol ?? '',
    )

    if (!internalToken) return

    const chain = internalToken?.chains.find(
      i => lc(i.id) === lc(this.#chainFrom?.name),
    )

    if (!chain) return

    return this.#tokens.find(i => lc(i.address) === lc(chain.token_address))
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
      params: this.#params,
      status: this.#status,
    })
  }
}

const getAmounts = (
  params: CheckoutOperationParams,
  e: EstimatedPrice,
): { amountIn: Amount; amountOut: Amount } => {
  const amountIn = e.from.isNative
    ? getNativeAmountIn(params, e.price)
    : e.price

  const amountOut = getSwapAmount(params)

  return { amountIn, amountOut }
}

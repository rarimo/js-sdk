import { extend, ref, toRaw } from '@distributedlab/reactivity'
import type { Token } from '@rarimo/bridge'
import type { IProvider } from '@rarimo/provider'
import {
  Amount,
  type BridgeChain,
  ChainTypes,
  DestinationTransactionStatus,
  isString,
  type TransactionBundle,
} from '@rarimo/shared'
import {
  createEVMSwapper,
  createSwapper,
  type IntermediateTokenOpts,
} from '@rarimo/swap'
import type { providers } from 'ethers'

import { USDC_MAP } from '@/const'
import { CheckoutOperationStatus, OperationEventBusEvents } from '@/enums'
import { errors } from '@/errors'
import type {
  CheckoutOperation,
  CheckoutOperationParams,
  PaymentToken,
  SwapEstimation,
} from '@/types'

import { createOperationEventBus } from '../event-bus'
import {
  checkout as _checkout,
  estimate,
  getEstimation,
  getPaymentTokensWithPairs,
  getSameChainSwapToToken,
  getSwapAmountOutWithBridgeFee,
  getTokenByAddress,
  handleCorrectProviderChain,
  isSameChainOperation,
  loadTokens,
} from './helpers'

/**
 * An operation on an EVM chain.
 *
 * @example
 * ```js
 * const provider = await createProvider(MetamaskProvider)
 * const op = createCheckoutOperation(EVMOperation, provider)
 * ```
 */
export const EVMOperation = (
  provider: IProvider,
  params: CheckoutOperationParams,
): CheckoutOperation => {
  const swapper = createSwapper(createEVMSwapper, provider)
  const bus = createOperationEventBus()

  const isInitialized = ref(false)
  const status = ref(CheckoutOperationStatus.Created)

  let isSameChain = false
  let isMultiplePayment = false
  let chainFrom = {} as BridgeChain
  let chainTo = {} as BridgeChain
  let tokens: Token[] = []
  let swapToToken = {} as Token
  let swapAmountOut = {} as Amount
  let intermediateOpts = {} as IntermediateTokenOpts

  const init = async () => {
    isInitialized.value = false
    _setStatus(CheckoutOperationStatus.Initializing)

    if (provider.chainType !== ChainTypes.EVM) {
      throw new errors.OperationInvalidProviderChainTypeError()
    }

    await swapper.init()

    chainFrom = swapper.getChainById(params.chainIdFrom)!
    chainTo = swapper.getChainById(params.chainIdTo)!

    if (!chainFrom || !chainTo) {
      throw new errors.OperationInvalidChainPairError()
    }

    tokens = await loadTokens(chainFrom)

    isSameChain = isSameChainOperation(params)
    isMultiplePayment = Boolean(params.isMultiplePayment)
    isInitialized.value = true

    swapToToken = _getSwapToToken()
    swapAmountOut = await _getSwapAmountOut()

    _emitEvent(OperationEventBusEvents.Initiated)
    _setStatus(CheckoutOperationStatus.Initialized)
  }

  const getSupportedChains = async () => {
    _setStatus(CheckoutOperationStatus.SupportedChainsLoading)

    const chains = swapper.chains.length
      ? swapper.chains
      : await swapper.getSupportedChains()

    _setStatus(CheckoutOperationStatus.SupportedChainsLoaded)

    return chains
  }

  const getPaymentTokens = async () => {
    if (!isInitialized.value) throw new errors.OperatorNotInitializedError()

    _setStatus(CheckoutOperationStatus.PaymentTokensLoading)

    await handleCorrectProviderChain(provider, chainFrom)

    const withPairs = await getPaymentTokensWithPairs({
      provider,
      chainFrom,
      chainTo,
      isMultiplePayment,
      tokens: tokens,
      to: swapToToken!,
      slippage: params.slippage,
      amountOut: swapAmountOut,
    })

    _setStatus(CheckoutOperationStatus.PaymentTokensLoaded)

    return withPairs
  }

  const estimatePrice = async (from: PaymentToken[]) => {
    if (!isInitialized.value) throw new errors.OperatorNotInitializedError()

    _setStatus(CheckoutOperationStatus.EstimatedPriceCalculating)

    const price = await estimate({
      chainIdFrom: chainFrom.id,
      chainIdTo: chainTo.id,
      isMultiplePayment,
      from,
      to: swapToToken,
      slippage: params.slippage,
      amountOut: swapAmountOut,
    })

    _setStatus(CheckoutOperationStatus.EstimatedPriceCalculated)

    return price
  }

  const checkout = async (
    estimations: SwapEstimation[],
    bundle?: TransactionBundle,
  ) => {
    if (!isInitialized.value) throw new errors.OperatorNotInitializedError()

    const isChainNotSupported = isMultiplePayment
      ? estimations.some(i => !i.from.chain.contractAddress)
      : !estimations[0].from.chain.contractAddress

    if (isChainNotSupported) {
      throw new errors.OperationChainNotSupportedError()
    }

    _setStatus(CheckoutOperationStatus.CheckoutStarted)

    const result = await _checkout({
      swapper,
      swapAmountOut,
      chainFrom,
      chainTo,
      to: swapToToken,
      isMultiplePayment,
      estimations,
      receiver: params.recipient,
      setStatus: _setStatus,
      bundle,
      ...(isSameChain && { intermediateOpts }),
    })

    _setStatus(CheckoutOperationStatus.CheckoutCompleted)

    return isString(result)
      ? result
      : (result as providers.TransactionReceipt)?.transactionHash
  }

  const getDestinationTx = async (
    sourceChain: BridgeChain,
    sourceTxHash: string,
  ) => {
    if (isSameChain) throw new errors.OperationSameChainDestinationTxError()

    _setStatus(CheckoutOperationStatus.DestinationTxPending)

    const result = await swapper.getDestinationTx(sourceChain, sourceTxHash)

    _setStatus(
      result.status === DestinationTransactionStatus.Success
        ? CheckoutOperationStatus.DestinationTxSuccess
        : CheckoutOperationStatus.DestinationTxFailed,
    )

    return result
  }

  const _getSwapToToken = () => {
    if (isSameChain) {
      return getSameChainSwapToToken(chainFrom, tokens, params.price.address)
    }

    const chainFromUSDC = getTokenByAddress(tokens, USDC_MAP[chainFrom.name]!)

    if (!chainFromUSDC) {
      throw new errors.OperationIntermediateTokenNotFoundError()
    }

    return chainFromUSDC
  }

  const _getSwapAmountOut = async () => {
    return isSameChain
      ? Amount.fromPlainObject(params.price)
      : _getChainToUSDCSwapAmountIn()
  }

  const _getChainToUSDCSwapAmountIn = async () => {
    const { chainIdTo, slippage, price } = params
    const chainToTokens = await loadTokens(chainTo!)

    const from = getSameChainSwapToToken(
      chainTo,
      chainToTokens,
      USDC_MAP[chainTo.name]!,
    )!
    const to = getSameChainSwapToToken(
      chainTo,
      chainToTokens,
      params!.price.address,
    )!

    // estimate USDC -> Target Token on the destination chain to determine
    // how much USDC is required to bridge without bridge % fee
    intermediateOpts = (await getEstimation({
      chainIdFrom: chainIdTo,
      chainIdTo,
      from,
      to,
      amountOut: getSwapAmountOutWithBridgeFee(price),
      slippage,
    })) as IntermediateTokenOpts

    return intermediateOpts.amountIn
  }

  const _setStatus = (s: CheckoutOperationStatus) => {
    status.value = s
    _emitEvent(OperationEventBusEvents.StatusChanged)
  }

  const _emitEvent = (event: OperationEventBusEvents) => {
    bus.emit(event, {
      chainFrom,
      params,
      isInitiated: isInitialized.value,
      status: status.value,
    })
  }

  return toRaw(
    extend(bus, {
      provider,
      isInitialized,
      status,
      chainFrom,
      init,
      getSupportedChains,
      getPaymentTokens,
      getDestinationTx,
      checkout: checkout as CheckoutOperation['checkout'],
      estimatePrice: estimatePrice as CheckoutOperation['estimatePrice'],
    }),
  )
}

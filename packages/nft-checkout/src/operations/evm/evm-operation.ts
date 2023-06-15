import { extend, ref, toRaw } from '@distributedlab/reactivity'
import { BN } from '@distributedlab/tools'
import type { Token } from '@rarimo/bridge'
import type { IProvider } from '@rarimo/provider'
import type { BridgeChain, TransactionBundle } from '@rarimo/shared'
import {
  Amount,
  ChainTypes,
  DestinationTransactionStatus,
  isArray,
  isString,
} from '@rarimo/shared'
import type { ExecuteArgs } from '@rarimo/swap'
import { createEVMSwapper, createSwapper } from '@rarimo/swap'
import type { providers } from 'ethers'

import { Price } from '@/entities'
import { CheckoutOperationStatus, OperationEventBusEvents } from '@/enums'
import { errors } from '@/errors'
import type {
  CheckoutOperation,
  CheckoutOperationParams,
  EstimatedPrice,
  PaymentToken,
} from '@/types'

import { createOperationEventBus } from '../event-bus'
import {
  estimate,
  getNativeAmountIn,
  getPaymentTokensWithPairs,
  getSwapAmount,
  getTargetToken,
  handleCorrectProviderChain,
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
export const EVMOperation = (provider: IProvider): CheckoutOperation => {
  const swapper = createSwapper(createEVMSwapper, provider)
  const bus = createOperationEventBus()
  const chainFrom = ref<BridgeChain>()
  const chainTo = ref<BridgeChain>()
  const params = ref<CheckoutOperationParams>()
  const targetToken = ref<Token>()
  const isInitialized = ref(false)
  const status = ref(CheckoutOperationStatus.Created)
  const tokens = ref<Token[]>([])

  const init = async (p: CheckoutOperationParams) => {
    setStatus(CheckoutOperationStatus.Initializing)
    await swapper.init()

    const from = swapper.getChainById(p.chainIdFrom)
    const to = swapper.getChainById(p.chainIdTo)

    if (!from || !to) {
      throw new errors.OperationInvalidChainPairError()
    }

    chainFrom.value = from
    chainTo.value = to
    params.value = p

    if (provider.chainType !== ChainTypes.EVM) {
      throw new errors.OperationInvalidProviderChainTypeError()
    }

    isInitialized.value = true

    emitEvent(OperationEventBusEvents.Initiated)
    setStatus(CheckoutOperationStatus.Initialized)
  }

  const loadSupportedChains = async () => {
    setStatus(CheckoutOperationStatus.SupportedChainsLoading)

    const chains = swapper.chains.length
      ? swapper.chains
      : await swapper.loadSupportedChains()

    setStatus(CheckoutOperationStatus.SupportedChainsLoaded)

    return chains
  }

  const loadPaymentTokens = async (
    chain?: BridgeChain,
    isMultiplePayment = false,
  ) => {
    if (!isInitialized.value) throw new errors.OperatorNotInitializedError()

    setStatus(CheckoutOperationStatus.PaymentTokensLoading)

    await handleCorrectProviderChain(provider, chain, chainFrom.value)

    if (!params.value || !chainFrom.value || !chainTo.value!) return []

    tokens.value = await loadTokens(chainFrom.value)

    targetToken.value = await getTargetToken(
      swapper,
      params.value,
      tokens.value,
      chainFrom.value,
      chainTo.value,
    )

    if (!targetToken.value) return []

    const withPairs = await getPaymentTokensWithPairs(
      provider,
      params.value,
      tokens.value,
      targetToken.value,
      chainFrom.value,
      isMultiplePayment,
    )

    setStatus(CheckoutOperationStatus.PaymentTokensLoaded)

    return withPairs
  }

  const estimatePrice = async (
    fromOrFromTokens: PaymentToken | PaymentToken[],
  ) => {
    if (!isInitialized.value || !params.value || !targetToken.value) {
      throw new errors.OperatorNotInitializedError()
    }

    setStatus(CheckoutOperationStatus.EstimatedPriceCalculating)

    const price = isArray(fromOrFromTokens)
      ? await estimatePriceMultiple(fromOrFromTokens)
      : await estimatePriceSingle(fromOrFromTokens as PaymentToken)

    setStatus(CheckoutOperationStatus.EstimatedPriceCalculated)

    return price
  }

  const estimatePriceMultiple = async (fromTokens: PaymentToken[]) => {
    const estimations: EstimatedPrice[] = []
    const totalAmountOut = BN.fromRaw('0', targetToken.value!.decimals)

    // We need to have target token amount with bridge fee to get correct
    // estimation for the multiple payment tokens
    const targetAmountOut = bnFromAmountLike(getSwapAmount(params.value!))

    for (const token of fromTokens) {
      const amountOut = targetAmountOut.clone().sub(totalAmountOut)

      const estimation = await estimatePriceSingle(
        token,
        Amount.fromBN(amountOut),
      )

      // If estimated price of the swap is less or equal than balance,
      // we can use it, otherwise, we need to use balance as amount in
      const isPriceLessThanOrEqualToBalance =
        estimation.price.isLessThanOrEqualTo(token.balanceRaw)

      const estimationToAdd = isPriceLessThanOrEqualToBalance
        ? estimation
        : {
            ...estimation,
            price: priceFromPaymentToken(token),
          }

      const amountToAdd = isPriceLessThanOrEqualToBalance
        ? bnFromAmountLike(estimation.price)
        : bnFromAmountLike(token.balanceRaw)

      estimations.push(estimationToAdd)
      totalAmountOut.add(amountToAdd)

      if (totalAmountOut.isEqualTo(targetAmountOut)) {
        return estimations
      }
    }

    throw new errors.OperationInsufficientFundsError()
  }

  const estimatePriceSingle = (from: PaymentToken, amountOut?: Amount) => {
    return estimate(
      provider,
      tokens.value,
      from,
      params.value!,
      targetToken.value!,
      amountOut,
    )
  }

  const checkout = async (
    e: EstimatedPrice | EstimatedPrice[],
    bundle?: TransactionBundle,
  ) => {
    if (!isInitialized.value || !params.value) {
      throw new errors.OperatorNotInitializedError()
    }

    const isEstimatedPriceArray = isArray(e)
    const isChainNotSupported = isEstimatedPriceArray
      ? e.some(i => !i.from.chain.contractAddress)
      : !e.from.chain.contractAddress

    if (isChainNotSupported) {
      throw new errors.OperationChainNotSupportedError()
    }

    const result = isEstimatedPriceArray
      ? await checkoutMultiple(e, bundle)
      : await checkoutSingle(e, bundle)

    setStatus(CheckoutOperationStatus.CheckoutCompleted)

    return isString(result)
      ? result
      : (result as providers.TransactionReceipt)?.transactionHash
  }

  const checkoutMultiple = async (
    e: EstimatedPrice[],
    bundle?: TransactionBundle,
  ) => {
    setStatus(CheckoutOperationStatus.CheckoutStarted)

    const result: ExecuteArgs[] = []

    for (const estimation of e) {
      const { amountIn, amountOut } = getAmounts(params.value!, estimation)

      if (!estimation.from.isNative) {
        await approveIfRequired(estimation.from, amountIn)
      }

      const executeArgs = createSwapperExecuteArgs(
        estimation,
        amountIn,
        amountOut,
        bundle,
      )

      result.push(executeArgs)
    }

    setStatus(CheckoutOperationStatus.SubmittingCheckoutTx)

    return swapper.execute(result, {
      amountOut: getSwapAmount(params.value!),
      to: targetToken.value!,
    })
  }

  const checkoutSingle = async (
    e: EstimatedPrice,
    bundle?: TransactionBundle,
  ) => {
    setStatus(CheckoutOperationStatus.CheckoutStarted)
    const { amountIn, amountOut } = getAmounts(params.value!, e)

    if (!e.from.isNative) await approveIfRequired(e.from, amountIn)

    setStatus(CheckoutOperationStatus.SubmittingCheckoutTx)

    return swapper.execute(
      createSwapperExecuteArgs(e, amountIn, amountOut, bundle),
    )
  }

  const getDestinationTx = async (
    sourceChain: BridgeChain,
    sourceTxHash: string,
  ) => {
    setStatus(CheckoutOperationStatus.DestinationTxPending)

    const result = await swapper.getDestinationTx(sourceChain, sourceTxHash)

    setStatus(
      result.status === DestinationTransactionStatus.Success
        ? CheckoutOperationStatus.DestinationTxSuccess
        : CheckoutOperationStatus.DestinationTxFailed,
    )

    return result
  }

  const approveIfRequired = async (token: Token, amount: Amount) => {
    setStatus(CheckoutOperationStatus.CheckAllowance)

    const isApproveRequired = await swapper.isApproveRequired(
      token,
      token.chain.contractAddress,
      amount,
    )

    if (!isApproveRequired) return

    setStatus(CheckoutOperationStatus.Approve)
    await swapper.approve(token, token.chain.contractAddress)
    setStatus(CheckoutOperationStatus.Approved)
  }

  const createSwapperExecuteArgs = (
    e: EstimatedPrice,
    amountIn: Amount,
    amountOut: Amount,
    bundle?: TransactionBundle,
  ): ExecuteArgs => {
    return {
      from: e.from,
      to: e.to,
      amountIn,
      amountOut,
      receiver: params.value!.recipient,
      path: e.path,
      chainTo: chainTo.value,
      bundle,
      isWrapped: IS_TOKEN_WRAPPED,
      handleAllowance: false,
    }
  }

  const setStatus = (s: CheckoutOperationStatus) => {
    status.value = s
    emitEvent(OperationEventBusEvents.StatusChanged)
  }

  const emitEvent = (event: OperationEventBusEvents) => {
    bus.emit(event, {
      isInitiated: isInitialized.value,
      chainFrom: chainFrom.value,
      params: params.value,
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
      loadSupportedChains,
      loadPaymentTokens,
      getDestinationTx,
      checkout: checkout as CheckoutOperation['checkout'],
      estimatePrice: estimatePrice as CheckoutOperation['estimatePrice'],
    }),
  )
}

const getAmounts = (
  params: CheckoutOperationParams,
  e: EstimatedPrice,
): { amountIn: Amount; amountOut: Amount } => {
  const amountIn = e.from.isNative
    ? getNativeAmountIn(params, e.price)
    : e.price

  const amountOut = getSwapAmount(params, e.amountOut)

  return { amountIn, amountOut }
}

const bnFromAmountLike = (amount: Amount): BN => {
  return BN.fromBigInt(amount.value, amount.decimals)
}

const priceFromPaymentToken = (token: PaymentToken): Price => {
  return Price.fromBigInt(
    token.balanceRaw.value,
    token.balanceRaw.decimals,
    token.symbol,
  )
}

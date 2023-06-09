import { extend, ref, toRaw } from '@distributedlab/reactivity'
import type { Token } from '@rarimo/bridge'
import type { IProvider } from '@rarimo/provider'
import type { BridgeChain, TransactionBundle } from '@rarimo/shared'
import {
  Amount,
  ChainTypes,
  DestinationTransactionStatus,
  isString,
} from '@rarimo/shared'
import { createEVMSwapper, createSwapper } from '@rarimo/swap'
import type { providers } from 'ethers'

import { OperationEventBusEvents } from '@/enums'
import { errors } from '@/errors'
import type {
  CheckoutOperation,
  CheckoutOperationParams,
  EstimatedPrice,
  PaymentToken,
} from '@/types'
import { CheckoutOperationStatus } from '@/types'

import { createOperationEventBus } from '../event-bus'
import {
  estimate,
  getNativeAmountIn,
  getPaymentTokensWithPairs,
  getSwapAmount,
  getTargetToken,
  handleCorrectProviderChain,
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
export const EVMOperation = (p: IProvider): CheckoutOperation => {
  const provider = p
  const swapper = createSwapper(createEVMSwapper, p)
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

  const supportedChains = async () => {
    setStatus(CheckoutOperationStatus.SupportedChainsLoading)

    const chains = swapper.chains.length
      ? swapper.chains
      : await swapper.supportedChains()

    setStatus(CheckoutOperationStatus.SupportedChainsLoaded)

    return chains
  }

  const loadPaymentTokens = async (chain?: BridgeChain) => {
    if (!isInitialized.value) throw new errors.OperatorNotInitializedError()

    setStatus(CheckoutOperationStatus.PaymentTokensLoading)

    await handleCorrectProviderChain(provider, chain, chainFrom.value)

    if (!params.value || !chainFrom.value || !chainTo.value!) return []

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
    )

    setStatus(CheckoutOperationStatus.PaymentTokensLoaded)

    return withPairs
  }

  const estimatePrice = async (from: PaymentToken) => {
    if (!isInitialized.value || !params.value || !targetToken.value) {
      throw new errors.OperatorNotInitializedError()
    }

    setStatus(CheckoutOperationStatus.EstimatedPriceCalculating)

    const price = await estimate(
      provider,
      tokens.value,
      from,
      params.value,
      targetToken.value,
    )

    setStatus(CheckoutOperationStatus.EstimatedPriceCalculated)

    return price
  }

  const checkout = async (e: EstimatedPrice, bundle?: TransactionBundle) => {
    if (!isInitialized.value || !params.value) {
      throw new errors.OperatorNotInitializedError()
    }

    if (!e.from.chain.contractAddress) {
      throw new errors.OperationChainNotSupportedError()
    }

    setStatus(CheckoutOperationStatus.CheckoutStarted)

    const { amountIn, amountOut } = getAmounts(params.value, e)

    if (!e.from.isNative) await approveIfRequired(e.from, amountIn)

    setStatus(CheckoutOperationStatus.SubmittingCheckoutTx)

    const result = await swapper.execute({
      from: e.from,
      to: e.to,
      amountIn,
      amountOut,
      receiver: params.value.recipient,
      path: e.path,
      chainTo: chainTo.value,
      bundle,
      isWrapped: IS_TOKEN_WRAPPED,
      handleAllowance: false,
    })

    setStatus(CheckoutOperationStatus.CheckoutCompleted)

    return isString(result)
      ? result
      : (result as providers.TransactionReceipt)?.transactionHash
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
      supportedChains,
      loadPaymentTokens,
      estimatePrice,
      checkout,
      getDestinationTx,
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

  const amountOut = getSwapAmount(params)

  return { amountIn, amountOut }
}

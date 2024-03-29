import { extend, ref, toRaw } from '@distributedlab/reactivity'
import { BN } from '@distributedlab/tools'
import type { Token } from '@rarimo/bridge'
import type { IProvider } from '@rarimo/provider'
import {
  type Address,
  Amount,
  type BridgeChain,
  ChainTypes,
  DestinationTransactionStatus,
  type HexString,
  isString,
  type TransactionBundle,
} from '@rarimo/shared'
import {
  createEVMSwapper,
  createSwapper,
  type IntermediateTokenOpts,
} from '@rarimo/swap'
import { type providers, utils } from 'ethers'

import { checkoutApi } from '@/api'
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
  bnFromAmountLike,
  checkout as _checkout,
  estimate,
  getEstimation,
  getPaymentTokensWithPairs,
  getSameChainSwapToToken,
  getTokenByAddress,
  getTokens,
  handleCorrectProviderChain,
  isSameChainOperation,
} from './helpers'

const RARIMO_BRIDGE_FEE = 2.5

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

  const isInitialized = ref(false)
  const status = ref(CheckoutOperationStatus.Created)

  const relayer = {
    [ChainTypes.EVM]: '0x1bbcc1c328e47805f050cb8c4bee9a6043997118',
    [ChainTypes.Solana]: '',
    [ChainTypes.Near]: '',
  }
  let params = {} as CheckoutOperationParams
  let isSameChain = false
  let isMultiplePayment = false
  let chainFrom = {} as BridgeChain
  let chainTo = {} as BridgeChain
  let chainFromTokens: Token[] = []
  let chainToTokens: Token[] = []
  let swapToToken = {} as Token
  let swapAmountOut = {} as Amount
  let intermediateOpts = {} as IntermediateTokenOpts

  const init = async (_params: CheckoutOperationParams) => {
    isInitialized.value = false
    _setStatus(CheckoutOperationStatus.Initializing)

    if (provider.chainType !== ChainTypes.EVM) {
      throw new errors.OperationInvalidProviderChainTypeError()
    }

    params = _params

    await swapper.init()

    chainFrom = swapper.getChainById(params.chainIdFrom)!
    chainTo = swapper.getChainById(params.chainIdTo)!

    if (!chainFrom || !chainTo) {
      throw new errors.OperationInvalidChainPairError()
    }

    await _loadTokens()

    isSameChain = isSameChainOperation(params)
    isMultiplePayment = Boolean(params.isMultiplePayment)
    isInitialized.value = true

    swapToToken = _getSwapToToken()
    swapAmountOut = await _getSwapAmountOut()

    if (params?.relayer?.[ChainTypes.EVM])
      relayer[ChainTypes.EVM] = params.relayer[ChainTypes.EVM]

    if (params?.relayer?.[ChainTypes.Solana])
      relayer[ChainTypes.Solana] = params.relayer[ChainTypes.Solana]

    if (params?.relayer?.[ChainTypes.Near])
      relayer[ChainTypes.Near] = params.relayer[ChainTypes.Near]

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
      tokens: chainFromTokens,
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

    if (bundle?.salt) bundle.salt = _getSalt(bundle.salt)

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
      ...(!isSameChain && { intermediateOpts }),
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
      return getSameChainSwapToToken(
        chainFrom,
        chainFromTokens,
        params.price.address,
      )
    }

    const chainFromUSDC = getTokenByAddress(
      chainFromTokens,
      USDC_MAP[chainFrom.name]!,
    )

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

    const usdcAddress = USDC_MAP[chainTo.name]!
    const getTokenArgs: [BridgeChain, Token[]] = [chainTo, chainToTokens]
    const from = getSameChainSwapToToken(...getTokenArgs, usdcAddress)!
    const to = getSameChainSwapToToken(...getTokenArgs, price.address)!

    const estimateArgs = {
      chainIdFrom: chainIdTo,
      chainIdTo,
      from,
      to,
      amountOut: Amount.fromBN(
        bnFromAmountLike(price).addPercent(RARIMO_BRIDGE_FEE),
      ),
      slippage,
    }

    // estimate USDC -> Target Token on the destination chain to determine
    // how much USDC is required to bridge with and without bridge % fee
    const estimationWithFee = await getEstimation(estimateArgs)

    // USDC could have different decimals on different chains, thus we need to
    // convert it to the same decimals as the chain from token.
    // If this method called - "swapToToken" always is USDC
    const chainFromUSDCAmountOut = bnFromAmountLike(
      estimationWithFee.amountIn,
    ).toDecimals(swapToToken.decimals)

    // Amount from which percent will be subtracted on the backend side has
    // precision chainFromUSDCAmountOut.decimals, thus we need to cut off
    // the extra precision from the chainFromUSDCAmountOut.raw, so we will create
    // a new BN instance from the chainFromUSDCAmountOut.value
    const amountIn = Amount.fromBN(
      BN.fromBigInt(
        chainFromUSDCAmountOut.value,
        chainFromUSDCAmountOut.decimals,
      )
        .subPercent(RARIMO_BRIDGE_FEE)
        .toDecimals(estimationWithFee.amountIn.decimals),
    )

    intermediateOpts = {
      ...estimationWithFee,
      amountIn,
      amountOut: price,
    }

    return Amount.fromBN(chainFromUSDCAmountOut)
  }

  const _loadTokens = async () => {
    if (isSameChain) {
      chainFromTokens = await getTokens(chainFrom)
      return
    }

    const [from, to] = await Promise.all([
      getTokens(chainFrom),
      getTokens(chainTo),
    ])
    chainFromTokens = from
    chainToTokens = to
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

  const _getSalt = (salt: HexString): HexString => {
    const sender = _getWithdrawTxSender()

    return new utils.AbiCoder().encode(['bytes32', 'address'], [salt, sender])
  }

  const _getWithdrawTxSender = () => {
    return isSameChain ? provider.address : relayer[ChainTypes.EVM]
  }

  const getBundlerAddress = async (salt: HexString): Promise<Address> => {
    if (!isInitialized.value) throw new errors.OperatorNotInitializedError()
    if (!salt) throw new TypeError('Salt is required')

    const { data } = await checkoutApi.get<Address>(
      '/v1/bridge/bundler-address',
      {
        query: {
          salt: _getSalt(salt),
        },
      },
    )

    if (!data) throw new errors.OperationBundlerAddressNotFoundError()

    return data
  }

  return toRaw(
    extend(
      {
        provider,
        isInitialized,
        status,
        chainFrom,
        init,
        getSupportedChains,
        getPaymentTokens,
        getDestinationTx,
        getBundlerAddress,
        checkout: checkout as CheckoutOperation['checkout'],
        estimatePrice: estimatePrice as CheckoutOperation['estimatePrice'],
      },
      bus,
    ),
  )
}

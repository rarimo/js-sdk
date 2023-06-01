import {
  JsonApiClient,
  JsonApiError,
  JsonApiRecordBase,
} from '@distributedlab/jac'
import { BN } from '@distributedlab/tools'
import {
  ChainId,
  ChainTypes,
  errors as providerErrors,
  IProvider,
} from '@rarimo/provider'
import { sleep } from '@rarimo/provider'
import { Contract, providers, utils } from 'ethers'

import { DEFAULT_CONFIG } from '@/config'
import {
  BUNDLE_SALT_BYTES,
  CHAINS,
  ERC20_ABI,
  NATIVE_TOKEN_WRAP_SLIPPAGE_MULTIPLIER,
  SWAP_CONTRACT_ABIS,
} from '@/const'
import { PaymentToken, Price, Token } from '@/entities'
import { ChainNames, OperationEventBusEvents } from '@/enums'
import { errors } from '@/errors'
import { toLow } from '@/helpers'
import type {
  BridgeChain,
  Config,
  DestinationTransaction,
  DestinationTransactionResponse,
  EstimatedPrice,
  INFTCheckoutOperation,
  OperationCreateParams,
  Target,
  TokenSymbol,
  TxBundle,
} from '@/types'
import { CheckoutOperationStatus, DestinationTransactionStatus } from '@/types'

import { OperationEventBus } from '../event-bus'
import {
  Estimator,
  getPaymentTokens,
  getSwapAmount,
  loadTokens,
} from './helpers'

export { TARGET_TOKEN_SYMBOLS } from './helpers/chain'

// We always use liquidity pool and not control those token contracts
// In case when `isWrapped: false`, bridge contract won't try to burn tokens
const IS_TOKEN_WRAPPED = false
const NATIVE_TOKEN_ADDRESS = '0x0000000000000000000000000000000000000000'
const DESTINATION_TX_PULL_INTERVAL = 2000

type InternalChain = JsonApiRecordBase<'chain'> & {
  bridge_contract: string
  chain_params: string | null
  chain_type: string
  name: string
  token_address: string
}

type InternalToken = JsonApiRecordBase<'token'> & {
  name: string
  symbol: string
  token_type: string
  chains: InternalChain[]
}

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
  #targetToken?: Token

  #chains: BridgeChain[] = []
  #tokens: Token[] = []
  #api: JsonApiClient
  #status: CheckoutOperationStatus = CheckoutOperationStatus.Created

  constructor(config: Config, provider: IProvider) {
    super()
    this.#config = config
    this.#provider = provider
    this.#api = new JsonApiClient({
      baseUrl: DEFAULT_CONFIG.CORE_API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        Origin: window?.origin ?? '',
      },
      credentials: 'omit',
    })
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

    this.#isInitialized = true

    this.#emitEvent(OperationEventBusEvents.Initiated)
    this.#setStatus(CheckoutOperationStatus.Initialized)
  }

  public async supportedChains(): Promise<BridgeChain[]> {
    // TODO: add backend integration
    this.#setStatus(CheckoutOperationStatus.SupportedChainsLoading)
    this.#chains = CHAINS[ChainTypes.EVM]!
    this.#setStatus(CheckoutOperationStatus.SupportedChainsLoaded)

    return this.#chains
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
    this.#targetToken = await this.#getTargetToken()

    if (!this.#targetToken) return []

    const tokens = result.filter(
      i => toLow(i.symbol) !== toLow(this.#targetToken?.symbol),
    )

    const estimatedPrices = await Promise.allSettled(
      tokens.map(i =>
        new Estimator(
          this.#provider,
          this.#tokens,
          i,
          this.#target!,
          this.#targetToken!,
        ).estimate(),
      ),
    )

    return estimatedPrices.reduce<PaymentToken[]>((acc, i) => {
      if (i.status === 'fulfilled') {
        const paymentToken = result.find(
          t => toLow(t.symbol) === toLow(i.value.from.symbol),
        )
        if (paymentToken) acc.push(paymentToken)
      }

      return acc
    }, [])
  }

  async #getTargetToken(): Promise<Token | undefined> {
    const params = this.#target!

    const targetTokenSymbol = getTargetTokenSymbol(
      this.#getChainByID(params.chainId)!,
      params.price.symbol,
    )

    if (!targetTokenSymbol) return

    const internalToken = await this.getInternalTokenMapping(targetTokenSymbol)

    if (!internalToken) return

    const chain = internalToken?.chains.find(
      i => toLow(i.id) === toLow(this.#chainFrom?.name),
    )

    if (!chain) return

    return chain.token_address === NATIVE_TOKEN_ADDRESS
      ? Token.fromChain(this.#chainFrom!)
      : this.#tokens.find(i => toLow(i.address) === toLow(chain.token_address))
  }

  async getInternalTokenMapping(
    targetTokenSymbol: string,
  ): Promise<InternalToken | undefined> {
    let result: InternalToken | undefined
    try {
      const { data } = await this.#api.get<InternalToken>(
        `/v1/tokens/${targetTokenSymbol}`,
      )
      result = data
    } catch (e) {
      console.error(e)
    }

    return result
  }

  public async estimatePrice(from: PaymentToken) {
    if (!this.isInitialized) throw new errors.OperatorNotInitializedError()
    this.#setStatus(CheckoutOperationStatus.EstimatedPriceCalculating)

    const price = new Estimator(
      this.#provider,
      this.#tokens,
      from,
      this.#target!,
      this.#targetToken!,
    ).estimate()

    this.#setStatus(CheckoutOperationStatus.EstimatedPriceCalculated)

    return price
  }

  public async checkout(e: EstimatedPrice, bundle?: TxBundle): Promise<string> {
    this.#setStatus(CheckoutOperationStatus.CheckoutStarted)

    const chain = e.from.chain
    await this.#sendApproveTxIfNeeded(String(chain.contractAddress), e)

    if (!chain.contractAddress) {
      throw new errors.OperationChainNotSupportedError()
    }

    this.#setStatus(CheckoutOperationStatus.SubmittingCheckoutTx)

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

    this.#setStatus(CheckoutOperationStatus.CheckoutCompleted)

    return typeof result === 'string'
      ? result
      : (result as providers.TransactionReceipt)?.transactionHash
  }

  public async getDestinationTx(
    sourceChain: BridgeChain,
    sourceTxHash: string,
  ): Promise<DestinationTransaction> {
    if (!this.isInitialized) throw new errors.OperatorNotInitializedError()
    this.#setStatus(CheckoutOperationStatus.DestinationTxPending)

    const chain = this.#getChainByID(sourceChain.id)
    if (!chain) {
      throw new errors.OperationChainNotSupportedError()
    }

    let transaction: DestinationTransactionResponse | undefined

    while (!transaction) {
      transaction = await this.#getDestinationTx(chain.name, sourceTxHash)
      if (!transaction) {
        await sleep(DESTINATION_TX_PULL_INTERVAL)
      }
    }

    const status =
      transaction!.status === DestinationTransactionStatus.Success
        ? CheckoutOperationStatus.DestinationTxSuccess
        : CheckoutOperationStatus.DestinationTxFailed

    this.#setStatus(status)

    return {
      hash: transaction!.id,
      status: transaction!.status,
    }
  }

  async #getDestinationTx(
    chainId: string,
    txHash: string,
  ): Promise<DestinationTransactionResponse | undefined> {
    try {
      const { data } = await this.#api.get<DestinationTransactionResponse>(
        `/v1/chains/${chainId}/transactions/${txHash}`,
      )
      return data
    } catch (e) {
      if ((e as JsonApiError).httpStatus === 404) {
        return undefined
      }

      throw e
    }
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

    const network = this.#chains.find(
      i => Number(i.id) === Number(this.#target?.chainId),
    )

    const bundleTuple = [
      bundle?.salt || utils.hexlify(utils.randomBytes(BUNDLE_SALT_BYTES)),
      bundle?.bundle ?? '',
    ]

    return new utils.Interface(
      SWAP_CONTRACT_ABIS[chain.contactVersion],
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

    this.#setStatus(CheckoutOperationStatus.CheckAllowance)

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

    this.#setStatus(CheckoutOperationStatus.Approve)

    const data = new utils.Interface(ERC20_ABI).encodeFunctionData('approve', [
      routerAddress,
      BN.MAX_UINT256.value,
    ])

    const result = this.#provider.signAndSendTx({
      from: this.#provider.address,
      to: e.from.address,
      data,
    })

    this.#setStatus(CheckoutOperationStatus.Approved)

    return result
  }

  #getChainByID(id: ChainId) {
    return this.#chains.find(chain => chain.id === id)
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

const getTargetTokenSymbol = (chain: BridgeChain, symbol: TokenSymbol) => {
  if (!chain.isTestnet) return symbol

  return (
    {
      [ChainNames.Goerli]: '2',
      [ChainNames.Sepolia]: '3',
      [ChainNames.Fuji]: '4',
      [ChainNames.Chapel]: '5',
    }[chain.name] ?? ''
  )
}

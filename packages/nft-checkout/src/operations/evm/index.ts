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
import { ChainId, ChainTypes, errors, IProvider } from '@rarimo/provider'
import {
  getPaymentTokens,
  loadTokens,
  Estimator,
  getSwapAmount,
  isV2,
} from './helpers'
import { CHAINS, SWAP_V3, ERC20_ABI, SWAP_V2 } from '../../const'

import { Contract, utils } from 'ethers'
import { BN } from '@distributedlab/utils'
import { OperationEventBus } from '../event-bus'

const MAX_UINT_256 =
  '115792089237316195423570985008687907853269984665640564039457584007913129639935'

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

  #chainFrom: BridgeChain
  #target?: Target

  #chains: BridgeChain[]
  #tokens: Token[] = []

  constructor(config: Config, provider: IProvider) {
    super()
    this.#config = config
    this.#provider = provider
  }

  public get chainFrom() {
    return this.#chainFrom
  }

  public get provider() {
    return this.#provider
  }

  public get isInitialized() {
    return this.#isInitialized
  }

  public get target() {
    return this.#target
  }

  /**
   * Initialize the operation with the source chain and transaction parameters
   * @param param0 Information about the source chain and the target transaction of the operation
   */
  async init({ chainIdFrom, target }: OperationCreateParams) {
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
  public async supportedChains() {
    // TODO: add backend integration
    this.#chains = CHAINS[ChainTypes.EVM]!

    return this.#chains
  }

  /**
   * Load the wallet's balance of payment tokens on the specified chain.
   *
   * @param chain A chain from {@link supportedChains}
   * @returns An array of tokens and the wallet's balance of each token
   */
  public async loadPaymentTokens(chain: BridgeChain) {
    if (!this.isInitialized) throw new errors.OperatorNotInitializedError()

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

  /**
   * Get the estimated purchase price in the payment token, including the cost to swap the tokens to the tokens that the seller accepts payment in
   *
   * @param from The token to use for the transaction
   * @returns Information about the costs involved in the transaction, including the gas price
   */
  public async estimatePrice(from: PaymentToken) {
    if (!this.isInitialized) throw new errors.OperatorNotInitializedError()

    return new Estimator(
      this.#provider,
      this.#tokens,
      from,
      this.#target!,
    ).estimate()
  }

  /**
   * Send a transaction to Rarimo for processing
   *
   * @param e The estimated price of the transaction, from {@link estimatePrice}
   * @param bundle The transaction bundle
   * @returns The hash of the transaction
   */
  public async checkout(e: EstimatedPrice, bundle: TxBundle) {
    const chain = e.from.chain

    await this.#sendApproveTxIfNeeded(String(chain.contractAddress), e)

    const contractInterface = new utils.Interface(
      isV2(chain) ? SWAP_V2 : SWAP_V3,
    )

    // TODO: fix for v2 native tokens
    const data = contractInterface.encodeFunctionData(
      'swapExactOutputMultiHopThenBridge',
      [
        getSwapAmount(this.#target!.price), // amount out
        e.price.value, // amount in Maximum
        e.path,
        this.#provider.address, // Receiver address
        this.#chains.find(i => Number(i.id) === Number(this.#target?.chainId))
          ?.name ?? '', // NFT chain name
        true,
        [bundle.salt || utils.hexlify(utils.randomBytes(32)), bundle.bundle],
      ],
    )

    return this.#provider.signAndSendTx({
      from: this.#provider.address,
      to: chain.contractAddress,
      data,
    })
  }

  async #sendApproveTxIfNeeded(routerAddress: string, e: EstimatedPrice) {
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
      MAX_UINT_256,
    ])

    await this.#provider.signAndSendTx({
      from: this.#provider.address,
      to: e.from.address,
      data,
    })
  }

  #getChainByID(id: ChainId) {
    return this.#chains.find(chain => chain.id === id)
  }

  async #loadTokens() {
    if (!this.isInitialized) return []

    this.#tokens = await loadTokens(this.#config, this.#chainFrom)

    return this.#tokens
  }

  async #switchChain() {
    if (!this.isInitialized) throw new errors.OperatorNotInitializedError()

    try {
      await this.#provider.switchChain(this.#chainFrom!.id)
    } catch (e) {
      if (!(e instanceof errors.ProviderChainNotFoundError)) {
        throw e
      }
      await this.#provider.addChain!(this.#chainFrom!)
      await this.#switchChain()
    }
  }
}

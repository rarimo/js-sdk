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
} from '@/types'
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
  getSwapAmount,
  loadTokens,
} from './helpers'
import {
  CHAINS,
  ERC20_ABI,
  SOLIDITY_MAX_UINT_256,
  SWAP_V2_ABI,
  SWAP_V3_ABI,
} from '@/const'
import { errors } from '@/errors'

import { Contract, utils } from 'ethers'
import { BN } from '@distributedlab/utils'
import { SwapContractVersion } from '@/enums'

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

    const contractInterface = new utils.Interface(
      SWAP_CONTRACT_ABIS[chain.contactVersion],
    )

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
      e.from.address,
      SOLIDITY_MAX_UINT_256,
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

import {
  BridgeChain,
  Config,
  EstimatedPrice,
  INFTCheckoutOperation,
  OperationCreateParams,
  PaymentToken,
  Target,
  Token,
} from '@/types'
import { ChainId, ChainTypes, errors, IProvider } from '@rarimo/provider'
import { JsonRpcProvider } from '@ethersproject/providers'
import {
  newRpcProvider,
  getPaymentTokens,
  loadTokens,
  Estimator,
} from './helpers'
import {
  CHAIN_IDS,
  CHAINS,
  BRIDGE_ABI,
  ERC20_ABI,
  BRIDGE_AVAX_ABI,
} from '@/const'
import { ChainNames } from '@/enums'

import { Contract, utils } from 'ethers'
import { BN } from '@distributedlab/utils'

const MAX_UINT_256 =
  '115792089237316195423570985008687907853269984665640564039457584007913129639935'

export class EVMOperation implements INFTCheckoutOperation {
  readonly #provider: IProvider
  readonly #config: Config

  #initialized = false

  #chainFrom: BridgeChain
  #target?: Target

  #rpc: JsonRpcProvider

  #chains: BridgeChain[]
  #tokens: Token[] = []

  constructor(config: Config, provider: IProvider) {
    this.#config = config
    this.#provider = provider
  }

  public get chain() {
    return this.#chainFrom
  }

  public get provider() {
    return this.#provider
  }

  public get initialized() {
    return this.#initialized
  }

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

    this.#rpc = newRpcProvider(from.rpcUrl, from.id)

    if (this.#provider.chainType !== ChainTypes.EVM) {
      throw new errors.OperationInvalidProviderChainTypeError()
    }

    this.#initialized = true
  }

  public async supportedChains() {
    // FIXME: add backend integration
    this.#chains = CHAINS[ChainTypes.EVM]!.map(chain => ({
      ...chain,
      rpcUrl: chain.rpcUrl + this.#config.INFURA_KEY,
    }))

    return this.#chains
  }

  public async loadPaymentTokens(chain: BridgeChain) {
    if (!this.initialized) throw new errors.OperatorNotInitializedError()

    if (!this.#provider.isConnected) {
      await this.#provider.connect()
    }

    if (this.#provider.chainId != chain.id) {
      await this.#switchChain()
    }

    return getPaymentTokens(
      this.#chainFrom!,
      this.#rpc,
      this.#provider.address!,
      await this.#loadTokens(),
    )
  }

  public async estimatePrice(from: PaymentToken) {
    if (!this.initialized) throw new errors.OperatorNotInitializedError()

    return new Estimator(
      this.#rpc,
      this.#tokens,
      from,
      this.#target!,
    ).estimate()
  }

  public async checkout(e: EstimatedPrice) {
    const isFuji =
      Number(e.from.chainId) ===
      Number(CHAIN_IDS[ChainTypes.EVM]![ChainNames.Fuji])

    const routerAddress = isFuji
      ? this.#config.RARIFY_ROUTER_ADDRESS_AVAX
      : this.#config.RARIFY_ROUTER_ADDRESS_UNISWAP

    await this.#sendApproveTxIfNeeded(routerAddress, e)

    const contractInterface = new utils.Interface(
      isFuji ? BRIDGE_AVAX_ABI : BRIDGE_ABI,
    )

    const bundle = utils.defaultAbiCoder.encode(
      ['address[]', 'uint256[]', 'bytes[]'],
      [
        // FIXME:  Does it should be in UINT?
        [this.#target?.address],
        [],
        [
          new utils.Interface([
            'function buy(address receiver_) payable',
          ]).encodeFunctionData('buy', [this.#provider.address]),
        ],
      ],
    )

    const estimatedPrice = e.price.find(
      i => i.symbol.toLowerCase() === e.from.symbol.toLowerCase(),
    )

    const data = contractInterface.encodeFunctionData(
      'swapExactOutputSingleThenBridge',
      [
        // FIXME: does it should be in UINT?
        this.#target?.price.value, // amount out
        // FIXME: does it should be in UINT?
        estimatedPrice?.value, // approval amount
        e.from.address,
        e.to.address,
        this.#provider.address, // Receiver address
        this.#target?.chainId, // NFT chain id
        true,
        { salt: utils.hexlify(utils.randomBytes(32)), bundle },
      ],
    )

    return this.#provider.signAndSendTx({
      to: routerAddress,
      data,
    })
  }

  async #sendApproveTxIfNeeded(routerAddress: string, e: EstimatedPrice) {
    const contract = new Contract(e.from.address, ERC20_ABI, this.#rpc)

    const allowanceRaw = await contract.allowance(
      this.#provider.address,
      routerAddress,
    )

    const estimationPriceRaw = e.price.find(
      i => i.symbol.toLowerCase() === e.from.symbol.toLowerCase(),
    )

    if (!estimationPriceRaw) {
      throw new errors.OperationEstimatedPriceNotExistError()
    }

    const allowance = new BN(allowanceRaw).fromWei()
    const estimationPrice = new BN(estimationPriceRaw.value)

    if (estimationPrice.compare(allowance) == -1) {
      return
    }

    // TODO: recheck if it's correct
    const data = new utils.Interface(ERC20_ABI).encodeFunctionData('approve', [
      MAX_UINT_256,
    ])

    await this.#provider.signAndSendTx({
      to: routerAddress,
      data,
    })
  }

  #getChainByID(id: ChainId) {
    return this.#chains.find(chain => chain.id === id)
  }

  async #loadTokens() {
    if (!this.initialized) return []

    this.#tokens = await loadTokens(
      this.#config,
      Number(this.#chainFrom?.id ?? ''),
    )

    return this.#tokens
  }

  async #switchChain() {
    if (!this.initialized) throw new errors.OperatorNotInitializedError()

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

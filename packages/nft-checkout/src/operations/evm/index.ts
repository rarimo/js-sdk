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
import { ChainId, ChainTypes, errors, IProvider } from '@rarimo/provider'
import { JsonRpcProvider } from '@ethersproject/providers'
import {
  newRpcProvider,
  getPaymentTokens,
  loadTokens,
  Estimator,
  getSwapAmount,
  isV2,
} from './helpers'
import { CHAINS, SWAP_V3, ERC20_ABI, SWAP_V2 } from '@/const'

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
    // TODO: add backend integration
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
      this.#provider.address!,
    ).estimate()
  }

  public async checkout(e: EstimatedPrice, bundle: TxBundle) {
    const chain = e.from.chain

    await this.#sendApproveTxIfNeeded(String(chain.contractAddress), e)

    const contractInterface = new utils.Interface(
      isV2(chain) ? SWAP_V2 : SWAP_V3,
    )

    const data = contractInterface.encodeFunctionData(
      'swapExactOutputSingleThenBridge',
      [
        getSwapAmount(this.#target!.price), // amount out
        e.price.value, // amount in Maximum
        e.from.address,
        e.to.address,
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
    const contract = new Contract(e.from.address, ERC20_ABI, this.#rpc)

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
    if (!this.initialized) return []

    this.#tokens = await loadTokens(this.#config, this.#chainFrom)

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

import { ChainTypes, IProvider } from '@rarimo/provider'

import { DEFAULT_CONFIG } from './config'
import { errors } from './errors'
import {
  Config,
  INFTCheckoutOperation,
  INFTCheckoutOperationConstructor,
} from './types'

export type Operators = {
  [key in ChainTypes]?: INFTCheckoutOperationConstructor
}

export type CreateCheckoutOperationParams = {
  config?: Partial<Config>
}

export class NFTCheckoutFactory {
  readonly #operators: Operators
  readonly #config: Config

  constructor(operators: Operators, config?: Partial<Config>) {
    this.#operators = operators
    this.#config = {
      ...DEFAULT_CONFIG,
      ...(config || {}),
    }
  }

  create(chainType: ChainTypes, provider: IProvider): INFTCheckoutOperation {
    if (!this.#operators[chainType]) {
      throw new errors.OperatorNotExistsError()
    }

    // eslint works like an idiot here
    return new this.#operators[chainType]!(this.#config, provider)
  }
}

/**
 *
 * @description Creates a transaction to buy NFTs and bundle other operations.
 *
 * For a full example, see [@rarimo/nft-checkout](../modules/_rarimo_nft_checkout.html).
 *
 * @example
 * const provider = await createProvider(MetamaskProvider)
 * const op = createCheckoutOperation(EVMCheckoutOperation, provider)
 */
export const createCheckoutOperation = (
  operator: INFTCheckoutOperationConstructor,
  provider: IProvider,
  params?: CreateCheckoutOperationParams,
): INFTCheckoutOperation => {
  const config = {
    ...DEFAULT_CONFIG,
    ...(params?.config || {}),
  }

  return new operator(config, provider)
}

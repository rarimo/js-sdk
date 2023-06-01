import type { IProvider } from '@rarimo/provider'
import type { ChainTypes } from '@rarimo/shared'

import { DEFAULT_CONFIG } from './config'
import { errors } from './errors'
import type {
  CheckoutOperation,
  CheckoutOperationConstructor,
  Config,
} from './types'

export type Operators = {
  [key in ChainTypes]?: CheckoutOperationConstructor
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

  create(chainType: ChainTypes, provider: IProvider): CheckoutOperation {
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
  operator: CheckoutOperationConstructor,
  provider: IProvider,
  params?: CreateCheckoutOperationParams,
): CheckoutOperation => {
  const config = {
    ...DEFAULT_CONFIG,
    ...(params?.config || {}),
  }

  return new operator(config, provider)
}

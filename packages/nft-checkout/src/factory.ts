import type { IProvider } from '@rarimo/provider'
import type { ChainTypes } from '@rarimo/shared'

import { errors } from './errors'
import type {
  CheckoutOperation,
  CheckoutOperationCreateFunction,
} from './types'

export type Operators = {
  [key in ChainTypes]?: CheckoutOperationCreateFunction
}

export class NFTCheckoutFactory {
  readonly #operators: Operators

  constructor(operators: Operators) {
    this.#operators = operators
  }

  create(chainType: ChainTypes, provider: IProvider): CheckoutOperation {
    if (!this.#operators[chainType]) {
      throw new errors.OperatorNotExistsError()
    }

    // eslint works like an idiot here
    return this.#operators[chainType]!(provider)
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
  operator: CheckoutOperationCreateFunction,
  provider: IProvider,
): CheckoutOperation => {
  return operator(provider)
}

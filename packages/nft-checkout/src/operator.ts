import {
  INFTCheckoutOperationConstructor,
  INFTCheckoutOperation,
  Config,
} from '@/types'
import { errors, ChainTypes, IProvider } from '@rarimo/provider'
import { CONFIG } from '@/config'

type Operators = { [key in ChainTypes]?: INFTCheckoutOperationConstructor }

export class NFTCheckoutFactory {
  readonly #operators: Operators
  readonly #config: Config = CONFIG

  constructor(operators: Operators) {
    this.#operators = operators
  }

  create(networkType: ChainTypes, provider: IProvider): INFTCheckoutOperation {
    if (!this.#operators[networkType]) {
      throw new errors.OperatorNotExistsError()
    }

    // eslint works like an idiot here
    return new this.#operators[networkType]!(this.#config, provider)
  }
}

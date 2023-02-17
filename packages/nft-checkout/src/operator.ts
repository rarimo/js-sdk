import {
  INFTCheckoutOperationConstructor,
  INFTCheckoutOperation,
  Config,
} from '@/types'
import { errors, ChainTypes, IProvider } from '@rarimo/provider'
import { DEFAULT_CONFIG } from '@/config'

type Operators = { [key in ChainTypes]?: INFTCheckoutOperationConstructor }

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

  create(networkType: ChainTypes, provider: IProvider): INFTCheckoutOperation {
    if (!this.#operators[networkType]) {
      throw new errors.OperatorNotExistsError()
    }

    // eslint works like an idiot here
    return new this.#operators[networkType]!(this.#config, provider)
  }
}

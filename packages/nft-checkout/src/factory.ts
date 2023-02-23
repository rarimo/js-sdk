import {
  INFTCheckoutOperationConstructor,
  INFTCheckoutOperation,
  Config,
} from './types'
import { errors, ChainTypes, IProvider } from '@rarimo/provider'
import { DEFAULT_CONFIG } from './config'

export type Operators = {
  [key in ChainTypes]?: INFTCheckoutOperationConstructor
}

export type CreateCheckoutOperationParams = {
  config?: Partial<Config>
}

export class NFTCheckoutFactory {
  #operators: Operators
  #config: Config

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
 * @description Creates a NFT checkout operation.
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

export const createProxyCheckoutOperation = (
  operator: INFTCheckoutOperationConstructor,
  // provider: IProvider,
  params?: CreateCheckoutOperationParams,
) => {
  const config = {
    ...DEFAULT_CONFIG,
    ...(params?.config || {}),
  }

  // const proxy = new Proxy(operator, {
  //   construct(target, args: [typeof config, IProvider]) {
  //     console.log('proxy')
  //     return target(...args)
  //   },
  // get<T>(target: T, key: keyof T) {
  //   console.log('get', key)
  //   return target[key]
  // },
  // // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // set<T>(target: T, key: keyof T, value: any, receiver: any) {
  //   console.log(key, value)
  //   console.log(receiver)
  //   target[key] = value
  //   return true
  // },
  // })

  // return proxy

  const proxy = new Proxy(operator, {
    get<T>(target: T, key: keyof T) {
      console.log('get', key)
      return target[key]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    set<T>(target: T, key: keyof T, value: any, receiver: any) {
      console.log(key, value)
      console.log(receiver)
      target[key] = value
      return true
    },
  })

  return { proxy, config }
}

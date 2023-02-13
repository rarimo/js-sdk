import { RuntimeError } from './runtime'

export class OperatorNotExistsError extends RuntimeError {
  constructor(message?: string) {
    super(message)
    this.name = 'OperatorNotExistsError'
  }
}

export class OperatorNotInitializedError extends RuntimeError {
  constructor(message?: string) {
    super(message)
    this.name = 'OperatorNotInitializedError'
  }
}

export class OperationChainNotSupportedError extends RuntimeError {
  constructor(message?: string) {
    super(message)
    this.name = 'OperationChainNotSupportedError'
  }
}

export class OperationSupportedTokensLoadFailedError extends RuntimeError {
  constructor(message?: string) {
    super(message)
    this.name = 'OperationSupportedTokensLoadFailedError'
  }
}

export class OperationInvalidSelectedTokenPairError extends RuntimeError {
  constructor(message?: string) {
    super(message)
    this.name = 'OperationInvalidSelectedTokenPairError'
  }
}

export class OperationEstimatedPriceNotExistError extends RuntimeError {
  constructor(message?: string) {
    super(message)
    this.name = 'OperationEstimatedPriceNotExistError'
  }
}

export class OperationInvalidChainPairError extends RuntimeError {
  constructor(message?: string) {
    super(message)
    this.name = 'OperationInvalidChainPairError'
  }
}

export class OperationSwapRouteNotFound extends RuntimeError {
  constructor(message?: string) {
    super(message)
    this.name = 'OperationSwapRouteNotFound'
  }
}

export class OperationInvalidProviderChainTypeError extends RuntimeError {
  constructor(message?: string) {
    super(message)
    this.name = 'OperationInvalidProviderChainTypeError'
  }
}

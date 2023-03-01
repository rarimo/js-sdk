import { RuntimeError } from '@rarimo/provider'

export class OperatorNotExistsError extends RuntimeError {
  constructor(message?: string) {
    super(message || 'Could not find implementation for this operator')
    this.name = 'OperatorNotExistsError'
  }
}

export class OperatorNotInitializedError extends RuntimeError {
  constructor(message?: string) {
    super(message || 'Provided operator is not initialized')
    this.name = 'OperatorNotInitializedError'
  }
}

export class OperationChainNotSupportedError extends RuntimeError {
  constructor(message?: string) {
    super(message || 'This chain is not supported yet')
    this.name = 'OperationChainNotSupportedError'
  }
}

export class OperationSupportedTokensLoadFailedError extends RuntimeError {
  constructor(message?: string) {
    super(message || 'Failed to load supported tokens for selected chain')
    this.name = 'OperationSupportedTokensLoadFailedError'
  }
}

export class OperationInvalidSelectedTokenPairError extends RuntimeError {
  constructor(message?: string) {
    super(message || 'Selected token pair is invalid')
    this.name = 'OperationInvalidSelectedTokenPairError'
  }
}

export class OperationEstimatedPriceNotExistError extends RuntimeError {
  constructor(message?: string) {
    super(message || 'Provided estimated price does not exist')
    this.name = 'OperationEstimatedPriceNotExistError'
  }
}

export class OperationInvalidChainPairError extends RuntimeError {
  constructor(message?: string) {
    super(message || 'Provided chain pair is invalid')
    this.name = 'OperationInvalidChainPairError'
  }
}

export class OperationInvalidTokenPairError extends RuntimeError {
  constructor(message?: string) {
    super(message || 'Provided token pair is invalid')
    this.name = 'OperationInvalidTokenPairError'
  }
}

export class OperationSwapRouteNotFound extends RuntimeError {
  constructor(message?: string) {
    super(message || 'Failed to find swap route')
    this.name = 'OperationSwapRouteNotFound'
  }
}

export class OperationInvalidProviderChainTypeError extends RuntimeError {
  constructor(message?: string) {
    super(message || 'Provided provider chain type is invalid')
    this.name = 'OperationInvalidProviderChainTypeError'
  }
}

export class OperatorInvalidSlippageError extends RuntimeError {
  constructor(message?: string) {
    super(
      message ||
        'Provided slippage is invalid. Slippage must be between 0 and 100',
    )
    this.name = 'OperatorInvalidSlippageError'
  }
}

export class OperatorWrappedTokenNotFound extends RuntimeError {
  constructor(message?: string) {
    super(
      message ||
        'Failed to find wrapped token for selected chain native token to estimate swap price',
    )
    this.name = 'OperatorWrappedTokenNotFound'
  }
}

import { RuntimeError } from '@rarimo/core'

export class OperatorNotExistsError extends RuntimeError {
  public name = 'OperatorNotExistsError'
  constructor(message = 'Could not find implementation for this operator') {
    super(message)
  }
}

export class OperatorNotInitializedError extends RuntimeError {
  public name = 'OperatorNotInitializedError'
  constructor(message = 'Provided operator is not initialized') {
    super(message)
  }
}

export class OperationChainNotSupportedError extends RuntimeError {
  public name = 'OperationChainNotSupportedError'
  constructor(message = 'This chain is not supported yet') {
    super(message)
  }
}

export class OperationSupportedTokensLoadFailedError extends RuntimeError {
  public name = 'OperationSupportedTokensLoadFailedError'
  constructor(message = 'Failed to load supported tokens for selected chain') {
    super(message)
  }
}

export class OperationInvalidSelectedTokenPairError extends RuntimeError {
  public name = 'OperationInvalidSelectedTokenPairError'
  constructor(message = 'Selected token pair is invalid') {
    super(message)
  }
}

export class OperationEstimatedPriceNotExistError extends RuntimeError {
  public name = 'OperationEstimatedPriceNotExistError'
  constructor(message = 'Provided estimated price does not exist') {
    super(message)
  }
}

export class OperationInvalidChainPairError extends RuntimeError {
  public name = 'OperationInvalidChainPairError'
  constructor(message = 'Provided chain pair is invalid') {
    super(message)
  }
}

export class OperationInvalidTokenPairError extends RuntimeError {
  public name = 'OperationInvalidTokenPairError'
  constructor(message = 'Provided token pair is invalid') {
    super(message)
  }
}

export class OperationSwapRouteNotFound extends RuntimeError {
  public name = 'OperationSwapRouteNotFound'
  constructor(message = 'Failed to find swap route') {
    super(message)
  }
}

export class OperationInvalidProviderChainTypeError extends RuntimeError {
  public name = 'OperationInvalidProviderChainTypeError'
  constructor(message = 'Provided provider chain type is invalid') {
    super(message)
  }
}

export class OperatorInvalidSlippageError extends RuntimeError {
  public name = 'OperatorInvalidSlippageError'
  constructor(
    message = 'Provided slippage is invalid. Slippage must be between 0 and 100',
  ) {
    super(message)
  }
}

export class OperatorWrappedTokenNotFound extends RuntimeError {
  public name = 'OperatorWrappedTokenNotFound'
  constructor(
    message = 'Failed to find wrapped token for selected chain native token to estimate swap price',
  ) {
    super(message)
  }
}

export class OperationSwapIntoNativeNotSupported extends RuntimeError {
  public name = 'OperationSwapIntoNativeNotSupported'
  constructor(
    message = 'NFT Checkout now not supports swapping into native tokens',
  ) {
    super(message)
  }
}

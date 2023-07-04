import { RuntimeError } from '@rarimo/shared'

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
  constructor(
    e = new Error('Failed to load supported tokens for selected chain'),
  ) {
    super(e)
  }
}

export class OperationInvalidSelectedTokenPairError extends RuntimeError {
  public name = 'OperationInvalidSelectedTokenPairError'
  constructor(message = 'Selected token pair is invalid') {
    super(message)
  }
}

export class OperationInvalidChainPairError extends RuntimeError {
  public name = 'OperationInvalidChainPairError'
  constructor(message = 'Provided chain pair is invalid') {
    super(message)
  }
}

export class OperationInvalidProviderChainTypeError extends RuntimeError {
  public name = 'OperationInvalidProviderChainTypeError'
  constructor(message = 'Provided provider chain type is invalid') {
    super(message)
  }
}

export class OperationInsufficientFundsError extends RuntimeError {
  public name = 'OperationInsufficientFundsError'
  constructor(
    message = 'Failed to estimate multiple tokens payment operation: insufficient funds, please make sure you have enough balance.',
  ) {
    super(message)
  }
}

export class OperationEstimateError extends RuntimeError {
  public name = 'OperationEstimateError'
  constructor(message = 'Failed to estimate payment operation') {
    super(message)
  }
}

export class OperationIntermediateTokenNotFoundError extends RuntimeError {
  public name = 'OperationIntermediateTokenNotFoundError'
  constructor(message = 'Failed to find intermediate token') {
    super(message)
  }
}

export class OperationSwapToTokenNotFoundError extends RuntimeError {
  public name = 'OperationSwapToTokenNotFoundError'
  constructor(message = 'Failed to find swap to token') {
    super(message)
  }
}

export class OperationPaymentTokensNotProvidedError extends RuntimeError {
  public name = 'OperationPaymentTokensNotProvidedError'
  constructor(message = 'There are no payment tokens provided') {
    super(message)
  }
}

export class OperationSameChainDestinationTxError extends RuntimeError {
  public name = 'OperationSameChainDestinationTxError'
  constructor(
    message = 'Operation destination is the same chain, thus transaction hash equals to the source one',
  ) {
    super(message)
  }
}

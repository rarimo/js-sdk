import { RuntimeError } from '@rarimo/shared'

export class BridgerInvalidChainTypeError extends RuntimeError {
  public name = 'BridgerInvalidChainTypeError'
  constructor(message = 'Provider and bridger chain types do not match') {
    super(message)
  }
}

export class BridgerZeroCommissionError extends RuntimeError {
  public name = 'BridgerZeroCommissionError'
  constructor(message = 'Commission cannot be zero') {
    super(message)
  }
}

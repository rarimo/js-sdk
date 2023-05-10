import { RuntimeError } from '@rarimo/shared'

export class BridgerInvalidChainTypeError extends RuntimeError {
  public name = 'BridgerInvalidChainTypeError'
  constructor(message = 'Provider and bridger chain types do not match') {
    super(message)
  }
}

export class BridgerChainNotSupportedError extends RuntimeError {
  public name = 'BridgerChainNotSupportedError'
  constructor(message = 'This chain is not supported yet') {
    super(message)
  }
}

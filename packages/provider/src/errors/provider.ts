import { RuntimeError } from '@rarimo/shared'

export class ProviderNotInitializedError extends RuntimeError {
  public name = 'ProviderNotInitializedError'
  constructor(e = new TypeError('Provider is not initialized')) {
    super(e)
  }
}

export class ProviderInjectedInstanceNotFoundError extends RuntimeError {
  public name = 'ProviderInjectedInstanceNotFoundError'
  constructor(
    e = new TypeError(
      'Cant find injected provider instance in window object, please check your provider installation',
    ),
  ) {
    super(e)
  }
}

export class ProviderChainNotFoundError extends RuntimeError {
  public name = 'ProviderChainNotFoundError'
  constructor(e = new TypeError('Cant detect chain in provider')) {
    super(e)
  }
}

export class ProviderUserRejectedRequest extends RuntimeError {
  public name = 'ProviderUserRejectedRequest'
  constructor(e = new TypeError('User rejected request')) {
    /**
     * @description ethers.js match provider `user denied` error message
     * and throw its own error instance, so we override error message with our own
     *
     * {@link https://github.com/ethers-io/ethers.js/blob/13593809bd61ef24c01d79de82563540d77098db/src.ts/providers/provider-jsonrpc.ts#L822}
     */
    super('User rejected request', e)
  }
}

export class ProviderUnauthorized extends RuntimeError {
  public name = 'ProviderUnauthorized'
  constructor(e = new TypeError('Provider unauthorized')) {
    super(e)
  }
}

export class ProviderUnsupportedMethod extends RuntimeError {
  public name = 'ProviderUnsupportedMethod'
  constructor(e = new TypeError('Provider not support this method')) {
    super(e)
  }
}

export class ProviderDisconnected extends RuntimeError {
  public name = 'ProviderDisconnected'
  constructor(e = new TypeError('Provider has been disconnected')) {
    super(e)
  }
}

export class ProviderChainDisconnected extends RuntimeError {
  public name = 'ProviderChainDisconnected'
  constructor(e = new TypeError('Provider chain has been disconnected')) {
    super(e)
  }
}

export class ProviderParseError extends RuntimeError {
  public name = 'ProviderParseError'
  constructor(e = new TypeError('Provider failed to parse')) {
    super(e)
  }
}

export class ProviderInvalidRequest extends RuntimeError {
  public name = 'ProviderInvalidRequest'
  constructor(e = new TypeError('Provider returned invalid request')) {
    super(e)
  }
}

export class ProviderMethodNotFound extends RuntimeError {
  public name = 'ProviderMethodNotFound'
  constructor(
    e = new TypeError('Provider method not implemented or not found'),
  ) {
    super(e)
  }
}

export class ProviderInvalidParams extends RuntimeError {
  public name = 'ProviderInvalidParams'
  constructor(e = new TypeError('Provider returned invalid params')) {
    super(e)
  }
}

export class ProviderInternalError extends RuntimeError {
  public name = 'ProviderInternalError'
  constructor(e = new TypeError('Provider internal error')) {
    super(e)
  }
}

export class ProviderInvalidInput extends RuntimeError {
  public name = 'ProviderInvalidInput'
  constructor(e = new TypeError('Provider returned invalid input')) {
    super(e)
  }
}

export class ProviderResourceNotFound extends RuntimeError {
  public name = 'ProviderResourceNotFound'
  constructor(
    e = new TypeError('Requesting resource does not exist on the blockchain.'),
  ) {
    super(e)
  }
}

export class ProviderResourceUnavailable extends RuntimeError {
  public name = 'ProviderResourceUnavailable'
  constructor(
    e = new TypeError(
      'Requested resource does exist, but it’s currently unavailable at the time of the request',
    ),
  ) {
    super(e)
  }
}

export class ProviderTransactionRejected extends RuntimeError {
  public name = 'ProviderTransactionRejected'
  constructor(e = new TypeError('Transaction rejected by some reason')) {
    super(e)
  }
}

export class ProviderMethodNotSupported extends RuntimeError {
  public name = 'ProviderMethodNotSupported'
  constructor(
    e = new TypeError(
      'The method is not supported at all. Possibly, it doesn’t exist or there’s just a typographical error',
    ),
  ) {
    super(e)
  }
}

export class ProviderLimitExceeded extends RuntimeError {
  public name = 'ProviderLimitExceeded'
  constructor(
    e = new TypeError('RPC provider has a rate limit that has been exceeded.'),
  ) {
    super(e)
  }
}

export class ProviderJsonRpcVersionNotSupported extends RuntimeError {
  public name = 'ProviderJsonRpcVersionNotSupported'
  constructor(e = new TypeError('JSON RPC version is not supported')) {
    super(e)
  }
}

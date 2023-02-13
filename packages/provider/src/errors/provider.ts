import { RuntimeError } from './runtime'

export class ProviderNotInitializedError extends RuntimeError {
  constructor(message?: string) {
    super(message)
    this.name = 'ProviderNotInitializedError'
  }
}

export class ProviderWrapperMethodNotFoundError extends RuntimeError {
  constructor(message?: string) {
    super(message)
    this.name = 'ProviderWrapperMethodNotFoundError'
  }
}

export class ProviderChainNotFoundError extends RuntimeError {
  constructor(message?: string) {
    super(message)
    this.name = 'ProviderChainNotFoundError'
  }
}

export class ProviderNotSupportedError extends RuntimeError {
  constructor(message?: string) {
    super(message)
    this.name = 'ProviderNotSupportedError'
  }
}

export class ProviderConstructorNotExistError extends RuntimeError {
  constructor(message?: string) {
    super(message)
    this.name = 'ProviderConstructorNotExistError'
  }
}

export class ProviderUserRejectedRequest extends RuntimeError {
  constructor(message?: string) {
    super(message)
    this.name = 'ProviderUserRejectedRequest'
  }
}

export class ProviderUnauthorized extends RuntimeError {
  constructor(message?: string) {
    super(message)
    this.name = 'ProviderUnauthorized'
  }
}

export class ProviderUnsupportedMethod extends RuntimeError {
  constructor(message?: string) {
    super(message)
    this.name = 'ProviderUnsupportedMethod'
  }
}

export class ProviderDisconnected extends RuntimeError {
  constructor(message?: string) {
    super(message)
    this.name = 'ProviderDisconnected'
  }
}

export class ProviderChainDisconnected extends RuntimeError {
  constructor(message?: string) {
    super(message)
    this.name = 'ProviderChainDisconnected'
  }
}

export class ProviderChainUnrecognized extends RuntimeError {
  constructor(message?: string) {
    super(message)
    this.name = 'ProviderChainUnrecognized'
  }
}

export class ProviderParseError extends RuntimeError {
  constructor(message?: string) {
    super(message)
    this.name = 'ProviderParseError'
  }
}

export class ProviderInvalidRequest extends RuntimeError {
  constructor(message?: string) {
    super(message)
    this.name = 'ProviderInvalidRequest'
  }
}

export class ProviderMethodNotFound extends RuntimeError {
  constructor(message?: string) {
    super(message)
    this.name = 'ProviderMethodNotFound'
  }
}

export class ProviderInvalidParams extends RuntimeError {
  constructor(message?: string) {
    super(message)
    this.name = 'ProviderInvalidParams'
  }
}

export class ProviderInternalError extends RuntimeError {
  constructor(message?: string) {
    super(message)
    this.name = 'ProviderInternalError'
  }
}

export class ProviderInvalidInput extends RuntimeError {
  constructor(message?: string) {
    super(message)
    this.name = 'ProviderInvalidInput'
  }
}

export class ProviderResourceNotFound extends RuntimeError {
  constructor(message?: string) {
    super(message)
    this.name = 'ProviderResourceNotFound'
  }
}

export class ProviderResourceUnavailable extends RuntimeError {
  constructor(message?: string) {
    super(message)
    this.name = 'ProviderResourceUnavailable'
  }
}

export class ProviderTransactionRejected extends RuntimeError {
  constructor(message?: string) {
    super(message)
    this.name = 'ProviderTransactionRejected'
  }
}

export class ProviderMethodNotSupported extends RuntimeError {
  constructor(message?: string) {
    super(message)
    this.name = 'ProviderMethodNotSupported'
  }
}

export class ProviderLimitExceeded extends RuntimeError {
  constructor(message?: string) {
    super(message)
    this.name = 'ProviderLimitExceeded'
  }
}

export class ProviderJsonRpcVersionNotSupported extends RuntimeError {
  constructor(message?: string) {
    super(message)
    this.name = 'ProviderJsonRpcVersionNotSupported'
  }
}

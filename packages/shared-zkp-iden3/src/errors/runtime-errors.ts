import { RuntimeError } from '@distributedlab/tools'

export class IssuerResponseEmptyError extends RuntimeError {
  public name = 'Issuer response empty'

  constructor(originalError: Error | string) {
    super(originalError)
  }
}

export class FileEmptyError extends RuntimeError {
  public name = 'Given file is empty'

  constructor(originalError: Error | string) {
    super(originalError)
  }
}

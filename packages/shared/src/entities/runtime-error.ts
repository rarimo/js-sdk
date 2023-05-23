import { isString } from '@/helpers'

export class RuntimeError extends Error {
  public name = 'RuntimeError'
  public originalError?: Error

  public constructor(errorOrMessage: Error | string)
  public constructor(message: string, error: Error)
  public constructor(errorOrMessage: Error | string, error?: Error) {
    const isErrorOrMessageIsString = isString(errorOrMessage)

    const message = isErrorOrMessageIsString
      ? errorOrMessage
      : errorOrMessage?.message

    super(message || 'Runtime error occurred')

    this.originalError =
      error || isErrorOrMessageIsString ? undefined : errorOrMessage
  }
}

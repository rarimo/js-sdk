export class RuntimeError extends Error {
  public name = 'RuntimeError'
  public originalError?: Error

  public constructor(errorOrMessage: Error | string)
  public constructor(message: string, error: Error)
  public constructor(errorOrMessage: Error | string, error?: Error) {
    const isErrorOrMessageString = typeof errorOrMessage === 'string'

    const message = isErrorOrMessageString
      ? errorOrMessage
      : errorOrMessage?.message

    super(message)

    this.originalError =
      error || isErrorOrMessageString ? undefined : errorOrMessage
  }
}

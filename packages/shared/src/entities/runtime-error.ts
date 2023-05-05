export class RuntimeError extends Error {
  public name = 'RuntimeError'
  constructor(message = 'Runtime error') {
    super(message)
  }
}

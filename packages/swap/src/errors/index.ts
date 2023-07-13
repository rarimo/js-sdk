import { RuntimeError } from '@rarimo/shared'

export class SwapperMultiplePaymentOptsEmptyError extends RuntimeError {
  constructor() {
    super('Multiple payment options are required')
  }
}

import { errors } from '@/errors'

export const validateSlippage = (slippage: number) => {
  if (slippage < 0 || slippage > 100) {
    throw new errors.OperatorInvalidSlippageError()
  }
}

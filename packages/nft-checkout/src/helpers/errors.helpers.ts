import { ErrorCode } from '@ethersproject/logger'
import { InsufficientReservesError } from '@traderjoe-xyz/sdk'
import { TokenInfo } from '@uniswap/token-lists'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isInsufficientLiquidity = (error: any) =>
  (error?.code === ErrorCode.CALL_EXCEPTION &&
    error?.method === 'getReserves()') ||
  error instanceof InsufficientReservesError ||
  error?.message.includes('No route found for swap')

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleError = (error: any, tokenToSwap: TokenInfo) => {
  if (isInsufficientLiquidity(error)) {
    return `Insufficient liquidity for ${tokenToSwap.symbol} (${tokenToSwap.name})`
  }
}

export { handleError }

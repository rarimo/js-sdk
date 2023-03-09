import { BN } from '@distributedlab/tools'

import { RARIMO_BRIDGE_FEE } from '@/const'
import { Price } from '@/entities'

const ONE = 1
const ONE_HUNDRED = 100

export const getSwapAmount = (price: Price) => {
  const decimals = price.decimals
  const numerator = BN.fromBigInt(price.value, decimals)

  const percentBN = BN.fromRaw(RARIMO_BRIDGE_FEE, decimals).div(
    BN.fromRaw(ONE_HUNDRED, decimals),
  )

  const denominator = BN.fromRaw(ONE, decimals).sub(percentBN)

  return numerator.div(denominator).value
}

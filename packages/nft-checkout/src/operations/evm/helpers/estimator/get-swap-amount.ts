import { BN } from '@distributedlab/utils'

import { RARIMO_BRIDGE_FEE } from '@/const'
import { Price } from '@/entities'

const ONE = 1
const ONE_HUNDRED = 100

export const getSwapAmount = (price: Price) => {
  const cfg = { decimals: price.decimals }

  const numerator = new BN(price.value, cfg).fromFraction(cfg.decimals)

  const denominator = new BN(ONE, cfg).sub(
    new BN(RARIMO_BRIDGE_FEE, cfg).div(ONE_HUNDRED),
  )

  return new BN(numerator.div(denominator), cfg)
    .toFraction(cfg.decimals)
    .toString()
}

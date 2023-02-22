import { Price } from '@/entities'
import { BN } from '@distributedlab/utils'
import { RARIMO_BRIDGE_FEE } from '@/const'

export const getSwapAmount = (price: Price) => {
  const amountBN = new BN(price.value).fromFraction(price.decimals)

  const fee = new BN(
    new BN(amountBN.toString(), { decimals: 24 })
      .mul(RARIMO_BRIDGE_FEE)
      .toString(),
    { decimals: 24 },
  ).div(100)

  return amountBN.add(fee).toFraction(price.decimals).toString()
}

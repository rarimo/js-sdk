import { Price } from '@/entities'
import { BN } from '@distributedlab/utils'

export const getSwapAmount = (price: Price) => {
  const amountBN = new BN(price.value).fromFraction(price.decimals)

  const fee = new BN(
    new BN(amountBN.toString(), { decimals: 24 }).mul(2.5).toString(),
    { decimals: 24 },
  ).div(100) // 2.5% for bridge fee

  return amountBN.add(fee).toFraction(price.decimals).toString()
}

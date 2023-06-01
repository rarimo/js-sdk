import type { CheckoutOperationParams } from '@rarimo/nft-checkout'
import { utils } from 'ethers'

export const buildDemoTransactionBundle = (
  recipient: string,
  params: CheckoutOperationParams,
  address: string,
) => {
  const encodedFunctionData = new utils.Interface([
    'function buy(address receiver_) payable',
  ]).encodeFunctionData('buy', [recipient])

  return utils.defaultAbiCoder.encode(
    ['address[]', 'uint256[]', 'bytes[]'],
    [[address], [params.price.value], [encodedFunctionData]],
  )
}

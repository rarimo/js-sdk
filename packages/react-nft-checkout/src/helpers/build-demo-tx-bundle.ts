import { Target } from '@rarimo/nft-checkout'
import { utils } from 'ethers'

export const buildDemoTxBundle = (targetNft: Target) => {
  const encodedFunctionData = new utils.Interface([
    'function buy(address receiver_) payable',
  ]).encodeFunctionData('buy', [targetNft.recipient])

  return utils.defaultAbiCoder.encode(
    ['address[]', 'uint256[]', 'bytes[]'],
    [[targetNft.address], [targetNft.price.value], [encodedFunctionData]],
  )
}

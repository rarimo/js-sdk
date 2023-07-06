import { BN } from '@distributedlab/tools'
import {
  type BridgeChain,
  ERC20_ABI,
  type TransactionBundle,
} from '@rarimo/shared'
import { utils } from 'ethers'

import { THIS_ADDRESS } from '@/const'
import { SwapCommands } from '@/enums'
import type { IntermediateTokenOpts } from '@/types'

import { encodeCommandPayload } from './helpers'
import { buildPayload } from './payload'
import { buildSameChainBundleData } from './same-chain'
import { buildSwapData } from './swap'
import { getTransferData } from './transfer'

export const buildIntermediateBundleData = (
  opts: IntermediateTokenOpts,
  chainTo: BridgeChain,
  receiver: string,
  bundle?: TransactionBundle,
): string => {
  const { from, to, amountIn, amountOut, path } = opts

  const swapDiamondContractAddress = chainTo.contractAddress
  const intermediateTokenAddress = from.address

  const swapDiamondFunctionData = encodeCommandPayload([
    buildPayload(SwapCommands.TransferFromErc20, [
      intermediateTokenAddress,
      amountIn.value,
    ]),
    ...buildSwapData(from, to, amountIn, amountOut, path!),
    ...(to.isNative && to.isUniswapV3
      ? [
          buildPayload(SwapCommands.UnwrapNative, [
            THIS_ADDRESS,
            amountOut.value,
          ]),
        ]
      : []),
    ...buildSameChainBundleData(bundle),
    ...getTransferData(from, receiver),
    ...getTransferData(to, receiver),
  ])

  // to be able to swap diamond transfer intermediate token from the proxy contract,
  // we need to approve the swap diamond contract to spend the intermediate token
  const approveFunctionData = new utils.Interface(ERC20_ABI).encodeFunctionData(
    'approve',
    [swapDiamondContractAddress, BN.MAX_UINT256.value],
  )

  return utils.defaultAbiCoder.encode(
    ['address[]', 'uint256[]', 'bytes[]'],
    [
      [intermediateTokenAddress, swapDiamondContractAddress],
      [
        '0', // for approve we don't need to send any amount
        '0', // the amount will always be 0, because the intermediate token is erc20
      ],
      [approveFunctionData, swapDiamondFunctionData],
    ],
  )
}

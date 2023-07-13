import type { Token } from '@rarimo/bridge'
import type { Amount, BridgeChain, TransactionBundle } from '@rarimo/shared'
import type { ExecuteArgs, IntermediateTokenOpts, Swapper } from '@rarimo/swap'

import { CheckoutOperationStatus } from '@/enums'
import type { SwapEstimation } from '@/types'

export const checkout = ({
  swapper,
  swapAmountOut,
  chainFrom,
  chainTo,
  to,
  isMultiplePayment,
  estimations,
  bundle,
  intermediateOpts,
  receiver,
  setStatus,
}: {
  swapper: Swapper
  swapAmountOut: Amount
  chainFrom: BridgeChain
  chainTo: BridgeChain
  to: Token
  isMultiplePayment: boolean
  estimations: SwapEstimation[]
  setStatus: (status: CheckoutOperationStatus) => void
  intermediateOpts?: IntermediateTokenOpts
  bundle?: TransactionBundle
  receiver?: string
}) => {
  const _checkoutSingle = async (
    estimation: SwapEstimation,
    bundle?: TransactionBundle,
  ) => {
    const args = await _buildExecuteArgs([estimation], bundle)
    setStatus(CheckoutOperationStatus.SubmittingCheckoutTx)
    return swapper.execute(args)
  }

  const _checkoutMultiple = async (
    estimations: SwapEstimation[],
    bundle?: TransactionBundle,
  ) => {
    const args = await _buildExecuteArgs(estimations, bundle)
    setStatus(CheckoutOperationStatus.SubmittingCheckoutTx)
    return swapper.execute(args)
  }

  const _buildExecuteArgs = async (
    estimations: SwapEstimation[],
    bundle?: TransactionBundle,
  ) => {
    const args: ExecuteArgs = {
      swapOpts: [],
      intermediateOpts,
      chainFrom,
      chainTo,
      receiver,
      bundle,
      // We always use liquidity pool and not control those token contracts
      // In case when `isWrapped: false` bridge contract won't try to burn tokens
      isWrapped: false,
      // Allowance will be handled by this package to emit events correctly
      handleAllowance: false,
      ...(isMultiplePayment
        ? {
            multiplePaymentsOpts: {
              amountOut: swapAmountOut,
              to,
            },
          }
        : {}),
    }

    for (const estimation of estimations) {
      if (!estimation.from.isNative) {
        await _approveIfRequired(estimation.from, estimation.amountIn)
      }

      args.swapOpts.push(estimation)
    }

    return args
  }

  const _approveIfRequired = async (token: Token, amount: Amount) => {
    setStatus(CheckoutOperationStatus.CheckAllowance)

    const isApproveRequired = await swapper.isApproveRequired(
      token,
      token.chain.contractAddress,
      amount,
    )

    if (!isApproveRequired) return

    setStatus(CheckoutOperationStatus.Approve)

    await swapper.approve(token, token.chain.contractAddress)

    setStatus(CheckoutOperationStatus.Approved)
  }

  return isMultiplePayment
    ? _checkoutMultiple(estimations, bundle)
    : _checkoutSingle(estimations[0], bundle)
}

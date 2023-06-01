import { BN } from '@distributedlab/tools'
import type { IProvider } from '@rarimo/provider'
import type { Amount, HexString } from '@rarimo/shared'
import { ERC20_ABI } from '@rarimo/shared'
import { Contract, utils } from 'ethers'

import type { Token } from '@/types'

export const isApproveERC20Required = async (
  provider: IProvider,
  operator: HexString,
  token: Token,
  amount?: Amount,
): Promise<boolean> => {
  const contract = new Contract(
    token.address,
    ERC20_ABI,
    provider?.getWeb3Provider?.(),
  )

  const allowanceRaw = await contract.allowance(provider.address, operator)

  if (!amount?.value) {
    throw new Error('Amount value is not defined')
  }

  const allowance = BN.fromBigInt(allowanceRaw.toString(), token.decimals)
  const estimationPrice = BN.fromBigInt(amount.value, amount.decimals)

  return estimationPrice.isGreaterThan(allowance)
}

export const approveIfNeeded = async (
  provider: IProvider,
  operator: HexString,
  token: Token,
  amount?: Amount,
) => {
  if (token.isNative) return

  const isRequired = await isApproveERC20Required(
    provider,
    operator,
    token,
    amount,
  )

  if (!isRequired) return

  return approve(provider, operator, token)
}

export const approve = async (
  provider: IProvider,
  operator: HexString,
  token: Token,
) => {
  const data = new utils.Interface(ERC20_ABI).encodeFunctionData('approve', [
    operator,
    BN.MAX_UINT256.value,
  ])

  return provider.signAndSendTx({
    from: provider.address,
    to: token.address,
    data,
  })
}

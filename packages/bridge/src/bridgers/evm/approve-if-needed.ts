import { BN } from '@distributedlab/tools'
import type { IProvider } from '@rarimo/provider'
import type { Amount, HexString } from '@rarimo/shared'
import { ERC20_ABI } from '@rarimo/shared'
import { Contract, utils } from 'ethers'

import type { Token } from '@/types'

const getApproveERC20Data = async (
  provider: IProvider,
  operator: HexString,
  token: Token,
  amount?: Amount,
) => {
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

  if (estimationPrice.isLessThan(allowance)) {
    return
  }

  return new utils.Interface(ERC20_ABI).encodeFunctionData('approve', [
    operator,
    BN.MAX_UINT256.value,
  ])
}

export const approveIfNeeded = async (
  provider: IProvider,
  operator: HexString,
  token: Token,
  amount?: Amount,
) => {
  if (token.isNative) return

  const data = await getApproveERC20Data(provider, operator, token, amount)

  if (!data) return

  return provider.signAndSendTx({
    from: provider.address,
    to: token.address,
    data,
  })
}

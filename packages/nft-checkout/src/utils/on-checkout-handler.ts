import { JsonRpcProvider as Provider } from '@ethersproject/providers'
// import { parseUnits } from '@ethersproject/units'
import { ethers } from 'ethers'

import { SwapPriceInput } from '@/types'
import { TESTNET_CHAIN_IDS } from '@/enums'

import { ERC20ABI } from '@/const/abi.const'
import { RarifyABI } from '@/const/rarify-abi.const'
import { RarifyABIAvax } from '@/const/rarify-abi-avax.const'
import { CONFIG } from '@/config'

interface CheckoutParams extends SwapPriceInput {
  estimatedPriceInToken: string
  // setTransactionStep: (step: number) => void
}

const getEncodedFunctionData = (receiver: string) => {
  const ABI = ['function buy(address receiver_) payable']
  const abiInterface = new ethers.utils.Interface(ABI)
  const encodedFunctionData = abiInterface.encodeFunctionData('buy', [receiver])

  return encodedFunctionData
}

const onCheckoutHandler = async (params: CheckoutParams) => {
  try {
    const {
      userWalletAddress,
      estimatedPriceInToken,
      inputToken,
      outputToken,
      inputAmount,
      jsonRPCUrlMap,
      paymentChainName,
      chainId,
      // setTransactionStep,
    } = params
    const TokenA = inputToken
    const TokenB = outputToken
    if (window.ethereum) {
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum)

      const jsonRpcProvider = new Provider(
        jsonRPCUrlMap[paymentChainName],
        chainId,
      )

      const signer = web3Provider.getSigner()

      // const typedValueParsed = parseUnits(
      //   estimatedPriceInToken,
      //   inputToken.decimals,
      // ).toString()

      const RARIFY_ROUTER_ADDRESS =
        chainId === TESTNET_CHAIN_IDS.fuji
          ? CONFIG.RARIFY_ROUTER_ADDRESS_AVAX
          : CONFIG.RARIFY_ROUTER_ADDRESS_UNISWAP

      const RARIFY_ABI =
        chainId === TESTNET_CHAIN_IDS.fuji ? RarifyABIAvax : RarifyABI

      const getWethContract = () =>
        new ethers.Contract(TokenA.address, ERC20ABI, jsonRpcProvider)

      const contract0 = getWethContract()

      const approvalAmount = ethers.utils
        .parseUnits(estimatedPriceInToken, TokenA.decimals)
        .toString()

      let newAmount = parseFloat(inputAmount)

      newAmount = newAmount + (newAmount * 2.5) / 100 // 2.5% for bridge fee

      const amountOut = ethers.utils
        .parseUnits(newAmount.toString(), TokenB.decimals)
        .toString()

      const allowance = await contract0.allowance(
        userWalletAddress,
        RARIFY_ROUTER_ADDRESS,
      )

      const allowanceInEther = ethers.utils.formatEther(allowance)

      // If price of token is greater than allownance then, ask user to approve token.
      if (parseFloat(estimatedPriceInToken) > parseFloat(allowanceInEther)) {
        // setTransactionStep(2)
        // Allowing smart contract to approve max amount of token so that allow popup comes up only first time.
        const approveAmount =
          '115792089237316195423570985008687907853269984665640564039457584007913129639935' // MaxUint256
        const approveTx = await contract0
          .connect(signer)
          .approve(RARIFY_ROUTER_ADDRESS, approveAmount)
        // setTransactionStep(3)
        await approveTx.wait()
      }

      const cont = new ethers.Contract(
        RARIFY_ROUTER_ADDRESS,
        RARIFY_ABI,
        signer,
      )

      const priceOfNft = ethers.utils
        .parseUnits(inputAmount.toString(), TokenB.decimals)
        .toString()

      const encodedFunctionData = getEncodedFunctionData(userWalletAddress)

      const abi = ethers.utils.defaultAbiCoder
      const bundle = abi.encode(
        ['address[]', 'uint256[]', 'bytes[]'],
        [
          ['0x77FEdfb705C8baC2E03aAD2Ad8A8Fe83e3E20FA1'],
          [priceOfNft],
          [encodedFunctionData],
        ],
      )
      const salt = ethers.utils.formatBytes32String(`${Math.random()}`)

      // setTransactionStep(4)

      const transaction = await cont.swapExactOutputSingleThenBridge(
        amountOut, // 100000000000000000000
        approvalAmount, // BigNumber.from(route?.methodParameters?.value), // 10000000000000000
        inputToken.address,
        outputToken.address,
        userWalletAddress,
        'Sepolia',
        true,
        {
          salt: salt,
          bundle,
        },
        // {
        //   gasLimit: 2100000, //  ethers.utils.hexlify(1000000),
        //   // deadline: 2661766724,
        // }
      )
      // setTransactionStep(5)
      const successTransaction = await transaction.wait()

      return successTransaction
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log({ e })
    throw e
    // TODO: handle error
  }
}

export { onCheckoutHandler }

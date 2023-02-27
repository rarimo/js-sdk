import {
  createCheckoutOperation,
  CreateCheckoutOperationParams,
  EVMOperation,
  INFTCheckoutOperation,
} from '@rarimo/nft-checkout'
import { IProvider } from '@rarimo/provider'
import { useCallback, useEffect, useState } from 'react'

export const useCheckoutOperation = (
  provider: IProvider | null,
  createCheckoutOperationParams?: CreateCheckoutOperationParams,
) => {
  const [checkoutOperation, setCheckoutOperation] =
    useState<INFTCheckoutOperation | null>(null)
  const [, setState] = useState(() => {
    return {
      isInitialized: checkoutOperation?.isInitialized,
      chainFrom: checkoutOperation?.chainFrom,
    }
  })

  const setListeners = useCallback(() => {
    if (!checkoutOperation) return

    checkoutOperation.onInitiated(({ chainFrom, isInitiated }) => {
      setState(prev => ({
        ...prev,
        chainFrom,
        isInitiated,
      }))
    })
  }, [checkoutOperation])

  useEffect(() => {
    if (!provider) return

    const op = createCheckoutOperation(
      EVMOperation,
      provider,
      createCheckoutOperationParams,
    )
    setCheckoutOperation(op)
  }, [createCheckoutOperationParams, provider])

  useEffect(() => {
    if (!checkoutOperation) return

    const init = async () => {
      // Call asynchronous supportedChains method to get supported chains on selected chain type
      const chains = await checkoutOperation.supportedChains()

      // In our case we hardcode Goerli chain as selected chain
      const selectedChain = chains[3]

      // NFT target params
      const target = {
        chainId: 11155111, // Source chain id (Sepolia in our case)
        address: '0x77fedfb705c8bac2e03aad2ad8a8fe83e3e20fa1', // Contract address
        recipient: '0x8fe0d4923f61ff466430f63471e27b89a7cf0c92', // Recipient wallet address
        price: {
          value: '10000000000000000', // Price amount in UINT (10000000000000000*10^18 = 0.01 ETH)
          decimals: 18, // Price amount decimals
          symbol: 'ETH', // Price token symbol
        },
      }

      await checkoutOperation.init({
        chainIdFrom: selectedChain.id,
        target,
      })
    }

    init()
  }, [checkoutOperation])

  useEffect(() => {
    setListeners()

    return () => {
      checkoutOperation?.clearHandlers()
    }
  }, [checkoutOperation, setListeners])

  return checkoutOperation
}

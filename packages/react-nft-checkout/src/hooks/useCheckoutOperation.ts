import {
  //   createCheckoutOperation,
  CreateCheckoutOperationParams,
  createProxyCheckoutOperation,
  EVMOperation,
  INFTCheckoutOperation,
} from '@rarimo/nft-checkout'
import { IProvider } from '@rarimo/provider'
import { useEffect, useState } from 'react'

import { useForceUpdate } from '@/hooks'

export const useCheckoutOperation = (
  provider: IProvider | null,
  createCheckoutOperationParams?: CreateCheckoutOperationParams,
) => {
  const forceUpdate = useForceUpdate()

  const [checkoutOperation, setCheckoutOperation] =
    useState<INFTCheckoutOperation | null>(null)
  //   const [proxyCheckoutOperation, setProxyCheckoutOperation] =
  //     useState<INFTCheckoutOperation | null>(null)

  useEffect(() => {
    if (!provider) return

    // const op = createCheckoutOperation(
    //   EVMOperation,
    //   provider,
    //   createCheckoutOperationParams,
    // )
    // setCheckoutOperation(op)
    const { proxy, config } = createProxyCheckoutOperation(
      EVMOperation,
      //   provider,
      createCheckoutOperationParams,
    )
    const op = new proxy(config, provider)
    //   console.log(first)
    setCheckoutOperation(op)

    // const handler = {
    //   get(target, key) {
    //     if (typeof target[key] === 'object' && target[key] !== null) {
    //       return new Proxy(target[key], handler)
    //     }
    //     // bind context to original object
    //     if (target[key] instanceof Function) {
    //       return target[key].bind(op)
    //     }
    //     return target[key]
    //   },
    //   set(target, prop, value) {
    //     console.log(`changed ${prop} from ${target[prop]} to ${value}`)
    //     target[prop] = value
    //   },
    // }

    // const proxyOp = new Proxy(op, handler)

    // setCheckoutOperation(proxyOp)
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
      //   forceUpdate()
    }

    init()
  }, [checkoutOperation])

  //   useEffect(() => {
  //     forceUpdate()
  //   }, [
  //     checkoutOperation?.chain,
  //     checkoutOperation?.initialized,
  //     checkoutOperation?.provider,
  //   ])

  return checkoutOperation
}

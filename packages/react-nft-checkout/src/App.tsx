import { Price } from '@rarimo/nft-checkout'
import { useRef } from 'react'

import { RarimoPayButton } from '@/components'
import { DappContextProvider } from '@/context/DappContextProvider'
import { buildDemoTransactionBundle } from '@/helpers/build-demo-tx-bundle'

const CONTRACT_ADDRESS = '0x77fedfb705c8bac2e03aad2ad8a8fe83e3e20fa1'

export const App = () => {
  const params = useRef({
    chainIdTo: 97, // Source chain id (Sepolia in our case)
    chainIdFrom: 5,
    recipient: '0x0000000000000000000000000000000000000000', // Recipient wallet address
    // The amount of token to swap the payment token to
    price: Price.fromRaw('0.01', 18, 'ETH'),
  }).current

  const createCheckoutTransactionBundleCb = useRef((recipient: string) =>
    buildDemoTransactionBundle(recipient, params, CONTRACT_ADDRESS),
  ).current

  return (
    <div className="app">
      <DappContextProvider
        params={params}
        createCheckoutTransactionBundleCb={createCheckoutTransactionBundleCb}
      >
        <RarimoPayButton />
      </DappContextProvider>
    </div>
  )
}

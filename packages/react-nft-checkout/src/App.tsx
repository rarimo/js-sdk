import { Price } from '@rarimo/nft-checkout'
import { useRef } from 'react'

import { RarimoPayButton } from '@/components'
import { DappContextProvider } from '@/context/DappContextProvider'
import { buildDemoTxBundle } from '@/helpers/build-demo-tx-bundle'

export const App = () => {
  const targetNft = useRef({
    chainId: 11155111, // Source chain id (Sepolia in our case)
    address: '0x77fedfb705c8bac2e03aad2ad8a8fe83e3e20fa1', // Contract address
    recipient: '0x0000000000000000000000000000000000000000', // Recipient wallet address
    price: Price.fromRaw('0.01', 18, 'ETH'),
    // The token to swap the payment token to
    swapTargetTokenSymbol: 'WETH',
  }).current

  const checkoutTxBundle = useRef(buildDemoTxBundle(targetNft)).current

  return (
    <div className="app">
      <DappContextProvider
        targetNft={targetNft}
        checkoutTxBundle={checkoutTxBundle}
      >
        <RarimoPayButton />
      </DappContextProvider>
    </div>
  )
}

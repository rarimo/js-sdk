# @rarimo/react-nft-checkout
Features of the Rarimo SDK that provide React components to manage cross-train transactions with the Rarimo protocol.

## Examples

For example applications, see [rarimo/js-sdk-examples](https://github.com/rarimo/js-sdk-examples/) on GitHub.

## Installation

The library can be installed via npm or yarn.

```bash
npm install @rarimo/react-nft-checkout
```

or

```bash
yarn add @rarimo/react-nft-checkout
```

If you need only the sdk-dapp basic logic, without the additional UI, consider using the `--no-optional` flag.
This will not install the packages needed for the optional UI components.

```bash
npm install @rarimo/react-nft-checkout --no-optional
```

or

```bash
yarn add @rarimo/react-nft-checkout --no-optional
```

# Customization

The React NFT Checkout uses MUI under the hood and exposes the MUI theme to allow for customization:

```jsx
const customTheme = {
  palette: {
    primary: {
      main: '#000000',
    },
  },
}

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
        <RarimoPayButton theme={customTheme} />
      </DappContextProvider>
    </div>
  )
}
```

## Changelog

For the change log, see [CHANGELOG.md](https://github.com/rarimo/js-sdk/blob/main/CHANGELOG.md).

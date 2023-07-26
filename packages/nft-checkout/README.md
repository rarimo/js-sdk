# @rarimo/nft-checkout
Features of the Rarimo SDK that create cross-chain transactions based on the Rarimo protocol.

![version (scoped package)](https://badgen.net/npm/v/@rarimo/nft-checkout)
![types](https://badgen.net/npm/types/@rarimo/nft-checkout)
![tree-shaking](https://badgen.net/bundlephobia/tree-shaking/@rarimo/nft-checkout)
![checks](https://badgen.net/github/checks/distributed-lab/web-kit/main)

## Example

For example applications, see [rarimo/js-sdk-examples](https://github.com/rarimo/js-sdk-examples/) on GitHub.

Here is an example of creating a transaction on the Goerli test chain:

```ts
import { ChainNames, BridgeChain } from '@rarimo/shared'
import {
  createCheckoutOperation,
  EVMOperation,
  CheckoutOperationParams,
  Price,
} from '@rarimo/nft-checkout'
import { createProvider } from '@rarimo/provider'
import { MetamaskProvider } from '@rarimo/providers-evm'
import { ethers } from "ethers"
import { ref } from 'vue'

// Address of the NFT sale contracts for test purposes
const MARKETPLACES: { [key in ChainNames]?: string } = {
  [ChainNames.Goerli]: "0x7711a35F092ec0941C0C58012c508814D3F9d43E",
  [ChainNames.Chapel]: '0x22d6A6946874F8Df79Bc9574e4cB72729c2d0c75',
  [ChainNames.Fuji]: '0xd5aA2aD7900da549cb029A5cff5E9396630B2EBC',
  [ChainNames.Ethereum]: '0x746689a27507839a6BD71fd3678169D3B4a28893',
  [ChainNames.BinanceSmartChain]: '0xd00142629BA0461218dfbB77D1fA652DaabDd48d',
  [ChainNames.Avalanche]: '0xebd22f080134e268a229895d4a89b98d2265aa3d',
  [ChainNames.Polygon]: '0x746689a27507839a6BD71fd3678169D3B4a28893',
}

// Chains to use
const sourceChainName = ChainNames.Goerli
const destinationChainName = ChainNames.Fuji

// Token to accept payment in
const paymentToken = "ETH"

// Token to receive payment in
const receiveToken = ref('Pending')

const sourceTxUrl = ref('')
const destinationTxUrl = ref('')

const sendTransaction = async () => {
  // Connect to the Metamask wallet in the browser, using the MetamaskProvider interface to limit bundle size.
  const provider = await createProvider(MetamaskProvider)

  // Initialize the object that represents the transaction operation, in this case on EVM.
  const op  = createCheckoutOperation(EVMOperation, provider)

  // Get the chains that are supported from that chain type.
  const chains = await op.getSupportedChains()

  // Select the chain to pay from.
  // This example uses the Goerli chain, but your application can ask the user which chain to use.
  const sourceChain = chains.find((i: BridgeChain) => i.name === sourceChainName)!

  // Select the chain to pay on.
  // In this case, the NFT contract is on the Fuji chain.
  const destinationChain = chains.find((i: BridgeChain) => i.name === destinationChainName)!
  receiveToken.value = destinationChain.token.symbol

  // Set the price and convert to wei
  const priceOfNft = Price.fromRaw('0.01', 18, destinationChain.token.symbol)

  // Set the parameters for the transaction, including source and destination chain.
  const params:CheckoutOperationParams = {
    chainIdFrom: sourceChain.id,
    chainIdTo: destinationChain.id,
    price: priceOfNft,
    recipient: provider.address,
    isMultiplePayment: false // Single payment token for a simple example
  }

  // Initialize the transaction object
  await op.init(params)

  // Load the user's balance of payment tokens on the source chain.
  // When this method runs, the wallet prompts the user to switch to the selected chain if necessary.
  // Then, the method returns the tokens on this chain that the DEX supports and that the wallet has a balance of greater than zero.
  const paymentTokens = await op.getPaymentTokens()

  // Select the token to accept payment in on the source chain.
  // This example hard-codes UNI, but your application can ask the user which token to pay with.
  const selectedToken = paymentTokens.find(i => i.symbol === paymentToken)!

  // Get the estimated cost of the token swap, not the total cost to the user
  const estimatedPrices = await op.estimatePrice([selectedToken])

  // Create the transaction bundle, which includes custom logic that tells the Rarimo contract what to do after unlocking the transferred tokens on the destination chain, such as calling another contract to buy the NFT on the destination chain.
  // Optionally, you can set the bundle salt to be able to access the temporary contracts that Rarimo uses to run the bundled transactions.
  // See "Bundling" in the Rarimo documentation.

  // First, use the Ethers Interface to encode a command to add to the bundle.
  // This example encodes a command that purchases the NFT on the destination chain via the NFT contract's Application Binary Interface (ABI).
  // You can include other custom logic in the bundle.
  const encodedFunctionData = new ethers.utils
    .Interface(["function buy(address receiver_) payable"])
    .encodeFunctionData("buy", [
      provider.address,
    ])

  // Then, create a bundle and add the purchase function.
  // The first parameter is the Solidity types of the values in the second parameter.
  // In this example, the parameters and their types are:
  // 1) The address of the contract that Rarimo will call to buy the NFT (`address[]`)
  // 2) The price of the NFT on the destination chain (`uint256[]`)
  // 3) The encoded purchase function (`bytes[]`)
  const bundle = ethers.utils.defaultAbiCoder.encode(
      ["address[]", "uint256[]", "bytes[]"],
      [
        [MARKETPLACES[destinationChainName]],
        [params.price.value],
        [encodedFunctionData],
      ]
  );

  // Call the asynchronous checkout method to run the transaction.
  // The `checkout()` method takes the parameters from the operation instance, gets approval from the user's wallet, and calls the Rarimo contract to handle the transaction.
  sourceTxUrl.value = 'Pending'
  destinationTxUrl.value = 'Pending'
  const txHash = await op.checkout(estimatedPrices, { bundle })

  // Get the transaction on the source chain
  sourceTxUrl.value = provider.getTxUrl(sourceChain!, String(txHash)) ?? ''

  // Get the transaction that unlocks tokens on the destination chain
  const destinationTx = await op.getDestinationTx(sourceChain!, String(txHash))
  destinationTxUrl.value = provider.getTxUrl(destinationChain!, destinationTx.hash) ?? ''
}

sendTransaction()
```

## Changelog

For the change log, see [CHANGELOG.md](https://github.com/rarimo/js-sdk/blob/main/CHANGELOG.md).

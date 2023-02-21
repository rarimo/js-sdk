# @rarimo/nft-checkout
Features of the Rarimo SDK that create cross-chain transactions based on the Rarimo protocol.

![version (scoped package)](https://badgen.net/npm/v/@rarimo/nft-checkout)
![types](https://badgen.net/npm/types/@rarimo/nft-checkout)
![tree-shaking](https://badgen.net/bundlephobia/tree-shaking/@rarimo/nft-checkout)
![checks](https://badgen.net/github/checks/distributed-lab/web-kit/main)

## Example

Here is an example of creating a transaction on the Goerli test chain:

```js
import { createCheckoutOperation, EVMOperation, ChainNames } from '@rarimo/nft-checkout'
import { createProvider, MetamaskProvider } from '@rarimo/provider'
import { utils } from "ethers";

const sendTransaction = async () => {
  // Connect to the Metamask wallet in the browser using Web3.js, using the MetamaskProvider interface to limit bundle size.
  const provider = await createProvider(MetamaskProvider)

  // Initialize the object that represents the transaction operation, in this case on EVM.
  const op = createCheckoutOperation(EVMOperation, provider)

  // Get the chains that are supported from that chain type.
  const chains = await op.supportedChains()

  // Select the Goerli chain.
  const selectedChain = chains.find(i => i.name === ChainNames.Goerli)

  // Set the parameters for the transaction, including the price and the tokens to accept payment in.
  const target = {
    // Destination chain id (Sepolia in this case)
    chainId: 11155111,
    // Address of the NFT sale contract
    address: "0x77fedfb705c8bac2e03aad2ad8a8fe83e3e20fa1",
    // Recipient's wallet address
    recipient: "0x8fe0d4923f61ff466430f63471e27b89a7cf0c92",
    price: {
      // Price amount as an unsigned integer
      value: "10000000000000000",
      // Number of decimals in the currency; in this case 18 for wei
      decimals: 18,
      // Price token symbol
      symbol: "ETH",
      // Results in a price of 10000000000000000/10^18, or 0.01 ETH
    },
  }

  // Initialize the operation with the source chain and transaction parameters.
  await op.init({
    chainIdFrom: selectedChain!.id,
    target,
  })

  // Load the user's balance of payment tokens on the source chain.
  const tokens = await op.loadPaymentTokens(selectedChain!)

  // Select the token to accept payment in on the source chain.
  // This example hard-codes UNI, but your application can ask the user which token to pay with.
  const paymentToken = tokens[0]

  // Get the estimated purchase price in the payment token, including the cost to swap the tokens to the tokens that the seller accepts payment in.
  const estimatedPrice = await op.estimatePrice(paymentToken)

  // Create the transaction bundle, which includes custom logic that tells the Rarimo contract what to do after unlocking the transferred tokens on the destination chain, such as calling another contract to buy the NFT on the destination chain.
  // Optionally, you can set the bundle salt to be able to access the temporary contracts that Rarimo uses to run the bundled transactions.
  // See "Bundling" in the Rarimo documentation.

  // First, encode a function to purchase the NFT on the destination chain.
  // You can include other custom logic in the bundle.
  const encodedFunctionData = new utils
    .Interface(["function buy(address receiver_) payable"])
    .encodeFunctionData("buy", [
      target.recipient,
    ])

  // Then, create a bundle and add the purchase function.
  // The first parameter is the Solidity types of the values in the second parameter.
  // These parameters and their types are:
  // 1) The address of the contract that Rarimo will call to buy the NFT (`address[]`)
  // 2) The price of the NFT on the destination chain (`uint256[]`)
  // 3) The encoded purchase function (`bytes[]`)
  const bundle = utils.defaultAbiCoder.encode(
      ["address[]", "uint256[]", "bytes[]"],
      [
        [target.address],
        [target.price.value],
        [encodedFunctionData],
      ]
  );

  // Call the asynchronous checkout method to run the transaction.
  // The `checkout()` method takes the parameters from the operation instance and calls the Rarimo contract to handle the checkout and approve the transaction if needed.
  const txHash = await op.checkout(estimatedPrice, { bundle })

  // Print a link to the transaction.
  console.log(provider.getTxUrl(selectedChain!, String(txHash)))
}
```

## Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

<details><summary>1.1.0</summary>
  <h4>Added</h4>
  <ul>
    <li>`createCheckoutOperation` function simplifies create NFT checkout operation.</li>
  </ul>
  <h4>Changed</h4>
  <ul>
    <li>Moved to the new swap contracts</li>
  </ul>
  <h4>Fixed</h4>
  <ul>
    <li>Approving non swap contract address, which cause error "transfer amount exceeds spender allowance"</li>
  </ul>
</details>
<details><summary>1.0.1</summary>
  <h4>Added</h4>
  <ul>
    <li>`events` dependency to resolve a Node emulation issue for use in packagers such as Vite</li>
  </ul>
</details>
<details><summary>1.0.0</summary>
  <h4>Under the hood changes</h4>
  <ul>
    <li>Initiated package</li>
  </ul>
</details>


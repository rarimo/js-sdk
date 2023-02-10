# @rarimo/nft-checkout
Features of the Rarimo SDK that create cross-chain transactions, based on the Rarimo protocol.

![version (scoped package)](https://badgen.net/npm/v/@rarimo/nft-checkout)
![types](https://badgen.net/npm/types/@rarimo/nft-checkout)
![tree-shaking](https://badgen.net/bundlephobia/tree-shaking/@rarimo/nft-checkout)
![checks](https://badgen.net/github/checks/distributed-lab/web-kit/main)

## Example

To connect to a wallet, create an instance of the `Web3` object, which provides access to the wallets in the customer's browser.
Then, create an object to represent the wallet to access.
These objects implement the `Provider` interface so you can access different wallets in a consistent way.

Here is an example of creating a `MetamaskProvider` object for a MetaMask wallet:

```js
import { Web3, Provider, Providers } from '@rarimo/core'
import { MetamaskProvider } from '@rarimo/metamask-provider'

const connectMetamask = async () => {
  // Detect the wallets that are available in the browser
  const web3 = await new Web3().init()

  // Create a wallet provider with the MetamaskProvider implementation
  const provider = await new Provider({
    [Providers.Metamask]: MetamaskProvider,
  }).init(web3.providers[Providers.Metamask])

  // Connect to the MetaMask wallet
  await provider.connect()
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


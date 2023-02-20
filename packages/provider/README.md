# @rarimo/provider
Features of the Rarimo SDK that provide access to users' wallets and map extensions for multiple types of wallets (EVM and non-EVM) to a common wallet interface.

![version (scoped package)](https://badgen.net/npm/v/@rarimo/provider)
![types](https://badgen.net/npm/types/@rarimo/provider)
![tree-shaking](https://badgen.net/bundlephobia/tree-shaking/@rarimo/provider)
![checks](https://badgen.net/github/checks/rarimo/js-sdk/main)

## Example

Here is an example that creates a `MetamaskProvider` object for a MetaMask wallet and prints its address:

```js
import { createProvider, MetamaskProvider } from '@rarimo/provider'

const getMetamaskBalances = async () => {
  // Connect to the Metamask wallet in the browser using Web3.js, using the MetamaskProvider interface to limit bundle size.
  const provider = await createProvider(MetamaskProvider)

  // Get the address of the wallet
  console.log(provider.address)
}
```

## Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

<details><summary>1.1.0</summary>
  <h4>Added</h4>
  <ul>
    <li>`createProvider` function, to simplify interface, which will create provider instance, user need to pass provider proxy implementation for needed wallet and web3 instance optionally.</li>
  </ul>
  <h4>Changed</h4>
  <ul>
    <li>Provider initiation, now constructor accepts one proxy implementation instead of map</li>
  </ul>
</details>
<details><summary>1.0.0</summary>
  <h4>Under the hood changes</h4>
  <ul>
    <li>Initiated package</li>
  </ul>
</details>


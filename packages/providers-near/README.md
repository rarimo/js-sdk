# @rarimo/providers-near
Features of the Rarimo SDK that provide access to wallets and the ability to interact with them on the NEAR blockchain.

![version (scoped package)](https://badgen.net/npm/v/@rarimo/providers-near)
![types](https://badgen.net/npm/types/@rarimo/providers-near)
![tree-shaking](https://badgen.net/bundlephobia/tree-shaking/@rarimo/providers-near)
![checks](https://badgen.net/github/checks/rarimo/js-sdk/main)

## Example

For example applications, see [rarimo/js-sdk-examples](https://github.com/rarimo/js-sdk-examples/) on GitHub.

Here is an example that creates a `NearProvider` object for a Near wallet and prints its address:

```js
import { createProvider } from '@rarimo/provider'
import { NearProvider } from '@rarimo/providers-near'

const getNearWalletAddress = async () => {
  // Connect to the MyNearWallet wallet in the browser using the NearProvider interface to limit bundle size.
  const provider = await createProvider(NearProvider)
  await provider.connect()

  // Get the address of the wallet
  console.log(provider.address)
}
```

## Changelog

For the change log, see [CHANGELOG.md](https://github.com/rarimo/js-sdk/blob/main/CHANGELOG.md).

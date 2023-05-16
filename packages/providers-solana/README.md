# @rarimo/providers-solana
Features of the Rarimo SDK that provide access to wallets and the ability to interact with them on the Solana blockchain.

![version (scoped package)](https://badgen.net/npm/v/@rarimo/providers-solana)
![types](https://badgen.net/npm/types/@rarimo/providers-solana)
![tree-shaking](https://badgen.net/bundlephobia/tree-shaking/@rarimo/providers-solana)
![checks](https://badgen.net/github/checks/rarimo/js-sdk/main)

## Example

For example applications, see [rarimo/js-sdk-examples](https://github.com/rarimo/js-sdk-examples/) on GitHub.

Here is an example that creates a `PhantomProvider` object for a Phantom wallet and prints its address:

```js
import { createProvider } from '@rarimo/provider'
import { PhantomProvider } from '@rarimo/providers-solana'

const getPhantomWalletAddress = async () => {
  // Connect to the Phantom wallet in the browser using the PhantomProvider interface to limit bundle size.
  const provider = await createProvider(PhantomProvider)
  await provider.connect()

  // Get the address of the wallet
  console.log(provider.address)
}
```

## Changelog

For the change log, see [CHANGELOG.md](https://github.com/rarimo/js-sdk/blob/main/CHANGELOG.md).

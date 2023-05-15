# @rarimo/react-provider
Tools to connect to wallets in React applications through the Rarimo SDK.

![version (scoped package)](https://badgen.net/npm/v/@rarimo/react-provider)
![types](https://badgen.net/npm/types/@rarimo/react-provider)
![tree-shaking](https://badgen.net/bundlephobia/tree-shaking/@rarimo/react-provider)
![checks](https://badgen.net/github/checks/rarimo/js-sdk/main)

## Example

For example applications, see [rarimo/js-sdk-examples](https://github.com/rarimo/js-sdk-examples/) on GitHub.

Here is an example that creates a `MetamaskProvider` object for a MetaMask wallet and prints its address:

```js
import { MetamaskProvider } from '@rarimo/provider'
import { useProvider } from '@rarimo/react-provider'

const { provider, ...rest } = useProvider(MetamaskProvider)

console.log({ provider, ...rest })
```

## Changelog

For the change log, see [CHANGELOG.md](https://github.com/rarimo/js-sdk/blob/main/CHANGELOG.md).

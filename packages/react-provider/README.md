# @rarimo/react-provider
Features of the Rarimo SDK that provide access to users' wallets and map extensions for multiple types of wallets (EVM and non-EVM) to a common wallet interface.

![version (scoped package)](https://badgen.net/npm/v/@rarimo/react-provider)
![types](https://badgen.net/npm/types/@rarimo/react-provider)
![tree-shaking](https://badgen.net/bundlephobia/tree-shaking/@rarimo/react-provider)
![checks](https://badgen.net/github/checks/rarimo/js-sdk/main)

## Example

Here is an example that creates a `MetamaskProvider` object for a MetaMask wallet and prints its address:

```js
import { MetamaskProvider } from '@rarimo/provider'

const { provider, ...rest } = useProvider(MetamaskProvider)

console.log({ provider, ...rest })
```

## Changelog

For the change log, see [CHANGELOG.md](https://github.com/rarimo/js-sdk/blob/main/CHANGELOG.md).

# @rarimo/identity-gen-iden3
Tools that generate distributed identities for the Iden3 protocol.

![version (scoped package)](https://badgen.net/npm/v/@rarimo/identity-gen-iden3)
![types](https://badgen.net/npm/types/@rarimo/identity-gen-iden3)
![tree-shaking](https://badgen.net/bundlephobia/tree-shaking/@rarimo/identity-gen-iden3)
![checks](https://badgen.net/github/checks/rarimo/js-sdk/main)

## Getting Started

### Installing

```
yarn add @rarimo/identity-gen-iden3
```

### Usage

```ts
Identity.setConfig({
  AUTH_BJJ_CREDENTIAL_HASH: '[your_hash]',
})
const identity = await Identity.create()
```

## Known Issues
[Read here](https://github.com/rarimo/js-sdk/blob/main/README.md#working-with-zkp-iden3-packages)

## License

This project is licensed under the MIT License - see the [LICENSE.md](../../LICENSE) file for details

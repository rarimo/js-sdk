# @rarimo/identity-gen-iden3
These packages aim to provide developers with a set of commonly used functions and features for building web applications, such as handling big numbers, date manipulation, subscribing to and receiving notifications when certain events occur with EventEmitter, and more.

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

### Important
Add this aliases to your client app build config
```ts
[
  { find: 'ethers', replacement: '../../node_modules/ethers/dist/ethers.esm.js' },
  { find: 'util', replacement: '../../node_modules/util/util.js' },
  { find: 'ejc', replacement: '../../node_modules/ejs/ejs.min.js' },
  { find: 'snarkjs', replacement: '../../node_modules/snarkjs/build/snarkjs.min.js' },
  { find: "@iden3/js-iden3-core", replacement: "../../node_modules/@iden3/js-iden3-core/dist/esm_esbuild/index.js" },
  { find: "@iden3/js-jwz", replacement: "../../node_modules/@iden3/js-jwz/dist/esm_esbuild/index.js" },
  { find: "@iden3/js-crypto", replacement: "../../node_modules/@iden3/js-crypto/dist/esm_esbuild/index.js" },
  { find: "@iden3/js-jsonld-merklization", replacement: "../../node_modules/@iden3/js-jsonld-merklization/dist/esm_esbuild/index.js" }
]
```

## Running the tests

```
yarn test
```

## License

This project is licensed under the MIT License - see the [LICENSE.md](../../LICENSE) file for details

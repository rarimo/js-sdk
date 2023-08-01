<h1><p align="center"><img style="background: white;" alt="Rarimo JS SDK" src="https://scan.testnet.rarimo.com/android-chrome-512x512.png" width="256" /></p></h1>

<div align="center">
  <a href="https://github.com/rarimo/js-sdk/blob/main/LICENSE">
    <img alt="License: MIT" src="https://img.shields.io/github/license/rarimo/js-sdk.svg" />
  </a>
</div>

# Rarimo JavaScript/Typescript SDK

Rarimo is a multichain protocol developed to solve the problems of liquidity, access, and interoperability across non-fungible and fungible use-cases. This suite of tools in this SDK makes it easy to build ground-breaking integrations on top of our technology.

## Example

For a complete running example, see [@rarimo/nft-checkout](https://rarimo.github.io/js-sdk/modules/_rarimo_nft_checkout.html).

For example applications, see [rarimo/js-sdk-examples](https://github.com/rarimo/js-sdk-examples/) on GitHub.

## Changelog

For the change log, see [CHANGELOG.md](https://github.com/rarimo/js-sdk/blob/main/CHANGELOG.md).

## API documentation

The full API documentation is hosted at [rarimo.github.io/js-sdk](https://rarimo.github.io/js-sdk).
This is Typedoc-generated documentation. It is helpful if you want to look up details for advanced use cases.
This documentation is auto-generated based on the current main branch and can diverge
from the latest release.

## Packages

The Rarimo SDK is a library that consists of many smaller NPM packages within the
[@rarimo namespace](https://www.npmjs.com/org/rarimo).

### Token swapping, bridging, and checkout packages

| Package                                                                                                | Description                                                                                                                                       | Latest                                                                                                                                  |
|--------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------|
| [@rarimo/shared](https://rarimo.github.io/js-sdk/modules/_rarimo_shared.html)                          | Utility functions, types, and constants shared across Rarimo packages.                                                                            | [![npm version](https://img.shields.io/npm/v/@rarimo/shared.svg)](https://www.npmjs.com/package/@rarimo/shared)                         |
| [@rarimo/bridge](https://rarimo.github.io/js-sdk/modules/_rarimo_bridge.html)                          | Internal tools that other Rarimo packages use to bridge tokens.                                                                                   | [![npm version](https://img.shields.io/npm/v/@rarimo/bridge.svg)](https://www.npmjs.com/package/@rarimo/bridge)                         |
| [@rarimo/swap](https://rarimo.github.io/js-sdk/modules/_rarimo_swap.html)                              | Internal tools that other Rarimo packages use to swap tokens.                                                                                     | [![npm version](https://img.shields.io/npm/v/@rarimo/swap.svg)](https://www.npmjs.com/package/@rarimo/swap)                             |
| [@rarimo/provider](https://rarimo.github.io/js-sdk/modules/_rarimo_provider.html)                      | A common interface for access to wallets (EVM and non-EVM) in the Rarimo SDK, used by packages that provide access to wallets on specific chains. | [![npm version](https://img.shields.io/npm/v/@rarimo/provider.svg)](https://www.npmjs.com/package/@rarimo/provider)                     |
| [@rarimo/providers-evm](https://rarimo.github.io/js-sdk/modules/_rarimo_providers_evm.html)            | Features of the Rarimo SDK that provide access to wallets and the ability to interact with them on EVM-compatible blockchains.                    | [![npm version](https://img.shields.io/npm/v/@rarimo/providers-evm.svg)](https://www.npmjs.com/package/@rarimo/providers-evm)           |
| [@rarimo/providers-solana](https://rarimo.github.io/js-sdk/modules/_rarimo_providers_solana.html)      | Features of the Rarimo SDK that provide access to wallets and the ability to interact with them on the Solana blockchain.                         | [![npm version](https://img.shields.io/npm/v/@rarimo/providers-solana.svg)](https://www.npmjs.com/package/@rarimo/providers-solana)     |
| [@rarimo/providers-near](https://rarimo.github.io/js-sdk/modules/_rarimo_providers_near.html)          | Features of the Rarimo SDK that provide access to wallets and the ability to interact with them on the NEAR blockchain.                           | [![npm version](https://img.shields.io/npm/v/@rarimo/providers-near.svg)](https://www.npmjs.com/package/@rarimo/providers-near)         |
| [@rarimo/nft-checkout](https://rarimo.github.io/js-sdk/modules/_rarimo_nft_checkout.html)              | Features of the Rarimo SDK that create cross-chain transactions based on the Rarimo protocol.                                                     | [![npm version](https://img.shields.io/npm/v/@rarimo/nft-checkout.svg)](https://www.npmjs.com/package/@rarimo/nft-checkout)             |
| [@rarimo/react-provider](https://rarimo.github.io/js-sdk/modules/_rarimo_react_provider.html)          | Tools to connect to wallets in React applications through the Rarimo SDK.                                                                         | [![npm version](https://img.shields.io/npm/v/@rarimo/react-provider.svg)](https://www.npmjs.com/package/@rarimo/react-provider)         |
| [@rarimo/react-nft-checkout](https://rarimo.github.io/js-sdk/modules/_rarimo_react_nft_checkout.html)  | Features of the Rarimo SDK that provide React components to manage cross-train transactions with the Rarimo protocol.                             | [![npm version](https://img.shields.io/npm/v/@rarimo/react-nft-checkout.svg)](https://www.npmjs.com/package/@rarimo/react-nft-checkout) |

### Identity packages

| Package                                                                                                | Description                                                                                | Latest                                                                                                                                  |
|--------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------|
| [@rarimo/identity-gen-iden3](https://rarimo.github.io/js-sdk/modules/_rarimo_identity_gen_iden_3.html) | Tools that generate distributed identities for the Iden3 protocol.                         | [![npm version](https://img.shields.io/npm/v/@rarimo/identity-gen-iden3.svg)](https://www.npmjs.com/package/@rarimo/identity-gen-iden3) |
| [@rarimo/auth-zkp-iden3](https://rarimo.github.io/js-sdk/modules/_rarimo_auth_zkp_iden_3.html)         | Tools that authenticate a zero-knowledge proof and provide verifiable credentials from it. | [![npm version](https://img.shields.io/npm/v/@rarimo/auth-zkp-iden3.svg)](https://www.npmjs.com/package/@rarimo/auth-zkp-iden3)         |
| [@rarimo/zkp-gen-iden3](https://rarimo.github.io/js-sdk/modules/_rarimo_zkp_gen_iden_3.html)           | Tools that generate zero-knowledge proofs for the Iden3 protocol.                          | [![npm version](https://img.shields.io/npm/v/@rarimo/zkp-gen-iden3.svg)](https://www.npmjs.com/package/@rarimo/zkp-gen-iden3)           |
| [@rarimo/shared-zkp-iden3](https://rarimo.github.io/js-sdk/modules/_rarimo_shared_zkp_iden_3.html)     | Internal tools that other Rarimo packages use for identity functionality.                  | [![npm version](https://img.shields.io/npm/v/@rarimo/shared-zkp-iden3.svg)](https://www.npmjs.com/package/@rarimo/shared-zkp-iden3)     |

### Other packages

| Package                                                                       | Description            | Latest                                                                                                          |
|-------------------------------------------------------------------------------|------------------------|-----------------------------------------------------------------------------------------------------------------|
| [@rarimo/client](https://rarimo.github.io/js-sdk/modules/_rarimo_client.html) | The Rarimo Core client | [![npm version](https://img.shields.io/npm/v/@rarimo/client.svg)](https://www.npmjs.com/package/@rarimo/client) |


## Known issues

### React
To use such packages as `@rarimo/provider` and `@rarimo/nft-checkout` in React project, created with [create-react-app](https://create-react-app.dev/) you need to add [craco](https://craco.js.org/) package and config to resolve the ESM version:

```shell
yarn add -D @craco/craco
```

Next, in the root of your project (where `package.json` is located) create a file named `craco.config.js` with the following content:

```js
module.exports = {
  webpack: {
    configure: {
      module: {
        rules: [
          {
            test: /\.m?js$/,
            resolve: {
              fullySpecified: false,
            },
          },
        ],
      },
    },
  },
}
```

This config disables the breaking change that causes [this error](https://stackoverflow.com/questions/70964723/webpack-5-in-ceate-react-app-cant-resolve-not-fully-specified-routes).

Then change the `start`/`build`/`test` commands in `package.json` replacing react-scripts to `craco`:

```json
{
  "scripts": {
    "start": "craco start",
    "build": "craco build",
    "test": "craco test"
  }
}
```

### Working with ZKP iden3 packages
Just because `iden3` libraries is developed for node, you need to follow next steps in your client:

First thing first, add the following packages to your project, because it marked as `peerDependencies`:

```bash
yarn add ethers util ejc snarkjs @iden3/js-iden3-core @iden3/js-jwz @iden3/js-crypto @iden3/js-jsonld-merklization
```

Then, ddd this aliases to your client app build config, especially if you are using ViteJs
```ts
[
  { find: 'ethers', replacement: '../../node_modules/ethers/dist/ethers.esm.js' },
  { find: 'util', replacement: '../../node_modules/util/util.js' },
  { find: 'ejc', replacement: '../../node_modules/ejs/ejs.min.js' },
  { find: 'snarkjs', replacement: '../../node_modules/snarkjs/build/snarkjs.min.js' },
  { find: '@iden3/js-iden3-core', replacement: "../../node_modules/@iden3/js-iden3-core/dist/esm_esbuild/index.js" },
  { find: '@iden3/js-jwz', replacement: "../../node_modules/@iden3/js-jwz/dist/esm_esbuild/index.js" },
  { find: '@iden3/js-crypto', replacement: "../../node_modules/@iden3/js-crypto/dist/esm_esbuild/index.js" },
  { find: '@iden3/js-jsonld-merklization', replacement: "../../node_modules/@iden3/js-jsonld-merklization/dist/esm_esbuild/index.js" }
]
```

## Development

### Editors

#### VSCode

To get ESLint and Prettier working in VSCode, install [ESLint extension] and add the following to your settings.json:

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "editor.formatOnSave": true,
  "eslint.validate": [
    "javascript",
    "typescript"
  ],
  "eslint.alwaysShowStatus": true,
  "eslint.packageManager": "yarn",
  "eslint.workingDirectories": [{ "mode": "auto" }]
}
```


[ESLint extension]: https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint

#### WebStorm

To get ESLint and Prettier working in WebStorm, go to `Preferences > Languages & Frameworks > JavaScript > Code Quality Tools > ESLint` and check the following:
- `Run eslint --fix on save` enabled
- `Automatic ESLint configuration` enabled
- `{**/*,*}.{js,ts}` in `Run for files` field

### Dependencies

#### Local dependencies

To install all dependencies, run:
```bash
yarn install
```

If you are implementing a new package which needs to depend on the local package, you can use the following command to install it:
```bash
yarn workspace @rarimo/target-package add @distributedlab/package-to-add
```

To install a dependency to all packages, use the following command:
```bash
yarn workspaces foreach -pt run add @rarimo/package-to-add
```

#### Testing dependencies

To test the packages, you need:

1. Build the packages:

    ```bash
    yarn build
    ```
2. Switch yarn to version berry in the project where you want to test package, to yarn be able to resolve workspace dependencies:

    ```bash
    yarn set version berry
    ```
3. Add this to the `.yarnrc.yml` file:

    ```yaml
    nodeLinker: node-modules
    ```
4. Link the packages to the project:

    ```bash
    yarn link -p -A /path/to/js-sdk/root/directory
    ```
5. Add dependencies to the package.json file:

    ```json
    {
      "dependencies": {
        "@rarimo/provider": "*"
      }
    }
    ```

6. Install the dependencies:
    ```bash
    yarn install
    ```

### Basics

#### Build

```bash
yarn build
```

#### Run tests

```bash
yarn test
```

#### Run linter

```bash
yarn lint
```

#### Check release version

```bash
yarn rsc 0.1.0
```

#### Bump version for all packages

```bash
yarn apply-version 0.1.0
```

### Resources
- [Yarn Berry](https://yarnpkg.com/cli/install)
- [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
- [Semantic Versioning](https://semver.org/spec/v2.0.0.html)


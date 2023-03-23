<h1><p align="center"><img style="background: white;" alt="Rarimo JS SDK" src="https://scan.testnet.rarimo.com/android-chrome-512x512.png" width="256" /></p></h1>

<div align="center">
  <a href="https://github.com/rarimo/js-sdk/blob/main/LICENSE">
    <img alt="License: MIT" src="https://img.shields.io/github/license/rarimo/js-sdk.svg" />
  </a>
</div>

# Rarimo JavaScript/Typescript SDK

Rarimo is a multichain protocol developed to solve the problems of liquidity, access, and interoperability across non-fungible and fungible use-cases. This suite of tools in this SDK makes it easy to build ground-breaking integrations on top of our technology.

## Example

For a complete example, see [@rarimo/nft-checkout](https://rarimo.github.io/js-sdk/modules/_rarimo_nft_checkout.html).

## Changelog

For the change log, see [CHANGELOG.md](https://github.com/rarimo/js-sdk/blob/main/CHANGELOG.md).

## API documentation

The full API documentation is hosted at [rarimo.github.io/js-sdk](https://rarimo.github.io/js-sdk).
This is Typedoc-generated documentation. It is helpful if you want to look up details for advanced use cases.
This documentation is auto-generated based on the current main branch and can diverge
from the latest release.

## Packages

The Rarimo SDK is a library that consists of many smaller NPM packages within the
[@rarimo namespace](https://www.npmjs.com/org/rarimo), a so-called monorepo.
Here are the packages in the namespace:

| Package                                | Description                                                                                                                                       | Latest                                                                                                                    |
|----------------------------------------| ------------------------------------------------------------------------------------------------------------------------------------------------- |---------------------------------------------------------------------------------------------------------------------------|
| [@rarimo/provider](https://rarimo.github.io/js-sdk/modules/_rarimo_provider.html)  | Provides access to wallets and wraps the wallet extension providers from different EVM and non-EVM chains to one common interface for ease of use | [![npm version](https://img.shields.io/npm/v/@rarimo/provider.svg)](https://www.npmjs.com/package/@rarimo/provider)       |
| [@rarimo/nft-checkout](https://rarimo.github.io/js-sdk/modules/_rarimo_nft_checkout.html) | Tools to create cross-train transactions with the Rarimo protocol | [![npm version](https://img.shields.io/npm/v/@rarimo/nft-checkout.svg)](https://www.npmjs.com/package/@rarimo/nft-checkout) |

## Webpack Configs

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

### Resources
- [Yarn Berry](https://yarnpkg.com/cli/install)
- [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
- [Semantic Versioning](https://semver.org/spec/v2.0.0.html)


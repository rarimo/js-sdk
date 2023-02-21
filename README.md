<h1><p align="center"><img style="background: white;" alt="Rarimo JS SDK" src="https://scan.testnet.rarimo.com/android-chrome-512x512.png" width="256" /></p></h1>

<div align="center">
  <a href="https://github.com/rarimo/js-sdk/blob/main/LICENSE">
    <img alt="License: MIT" src="https://img.shields.io/github/license/rarimo/js-sdk.svg" />
  </a>
</div>

# Rarimo JavaScript SDK

TypeScript-based source development script for Rarimo Protocol

## Changelog

Change log can be found by the following link: [CHANGELOG.md](https://github.com/rarimo/js-sdk/blob/main/CHANGELOG.md)

## API documentation

The full API documentation is hosted at [rarimo.github.io/js-sdk](https://rarimo.github.io/js-sdk).
This is Typedoc-generated documentation. It is helpful if you want to look up details for advanced use cases.
This documentation is auto-generated based on the current main branch and can occasionally diverge
from the latest release.

## Packages

Rarimo JavaScript SDK is a library that consists of many smaller npm packages within the
[@rarimo namespace](https://www.npmjs.com/org/rarimo), a so-called monorepo.
Here are some of them to get an idea:

| Package                                | Description                                                                                                                                                                                                                              | Latest                                                                                                                    |
|----------------------------------------| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |---------------------------------------------------------------------------------------------------------------------------|
| [@rarimo/provider](packages/provider)  | A package which wraps managing multiple (EVM and non EVM type) chains wallet extension providers to the one common interface.| [![npm version](https://img.shields.io/npm/v/@rarimo/provider.svg)](https://www.npmjs.com/package/@rarimo/provider)       |
| [@rarimo/nft-checkout](packages/nft-checkout) | A package with cross-chain NFT purchases functionality, based on Rarimo Protocol.| [![npm version](https://img.shields.io/npm/v/@rarimo/nft-checkout.svg)](https://www.npmjs.com/package/@rarimo/nft-checkout) |

## Webpack Configs

With Webpack 4 you don't need to do anything, but for Webpack 5
you have to add the following to your Webpack config:

```js
module.exports = [
  {
    // ...
    plugins: [
      ...,
      new webpack.ProvidePlugin({
        Buffer: ["buffer", "Buffer"],
      }),
    ],
    // ...
    resolve: {
      fallback: {
        buffer: false,
        crypto: false,
        events: false,
        path: false,
        stream: false,
        string_decoder: false,
      },
    },
  },
]
```
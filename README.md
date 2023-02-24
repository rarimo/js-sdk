<h1><p align="center"><img style="background: white;" alt="Rarimo JS SDK" src="https://scan.testnet.rarimo.com/android-chrome-512x512.png" width="256" /></p></h1>

<div align="center">
  <a href="https://github.com/rarimo/js-sdk/blob/main/LICENSE">
    <img alt="License: MIT" src="https://img.shields.io/github/license/rarimo/js-sdk.svg" />
  </a>
</div>

# Rarimo JavaScript SDK

Rarimo is a multichain protocol developed to solve the problems of liquidity, access, and interoperability across non-fungible and fungible use-cases. We have created a suite of tools that make it easy to build ground-breaking integrations on top of our technology.

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
Here are the packages in the namespace:

| Package                                | Description                                                                                                                                       | Latest                                                                                                                    |
|----------------------------------------| ------------------------------------------------------------------------------------------------------------------------------------------------- |---------------------------------------------------------------------------------------------------------------------------|
| [@rarimo/provider](https://rarimo.github.io/js-sdk/modules/_rarimo_provider.html)  | Provides access to wallets and wraps the wallet extension providers from different EVM and non-EVM chains to one common interface for ease of use | [![npm version](https://img.shields.io/npm/v/@rarimo/provider.svg)](https://www.npmjs.com/package/@rarimo/provider)       |
| [@rarimo/nft-checkout]https://rarimo.github.io/js-sdk/modules/_rarimo_nft_checkout.html) | Tools to create cross-train transactions with the Rarimo protocol | [![npm version](https://img.shields.io/npm/v/@rarimo/nft-checkout.svg)](https://www.npmjs.com/package/@rarimo/nft-checkout) |

## Webpack Configs

With Webpack 4 you don't need to do anything, but for Webpack 5
you must add the following code to your Webpack config:

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

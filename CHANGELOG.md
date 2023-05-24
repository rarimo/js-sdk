## Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- `@rarimo/shared` - Utility functions, types and constants shared across @rarimo packages.
- `@rarimo/bridge` - All bridge related functionality for the Rarimo Protocol.
- `@rarimo/swap` - Rarimo swap package.

### Changed
- `@rarimo/nft-checkout` - Moved some reusable types, const, helpers, enums to the `@rarimo/shared` package
- `@rarimo/provider` - Moved some reusable types, const, helpers, enums to the `@rarimo/shared` package
- `@rarimo/provider` - Bump `@distributedlab/tools` to 0.2.0-rc.9
- `@rarimo/nft-checkout` - Bump `@distributedlab/tools`, `@distributedlab/fetcher`, `@distributedlab/jac` to the last versions
- `@rarimo/nft-checkout` - Move building of the transaction to the `Swapper` from `@rarimo/swap` which implementation based on the `evm-swap-v2` contracts

### Fixed
- `all` - Node resolution in the `package.json` files

## [1.5.0-rc.18] - 2023-05-24
### Changed
- `@rarimo/nft-checkout` - Use multi hop routes for the swap price estimating on BSC instead of direct routes

## [1.5.0-rc.17] - 2023-05-23
### Fixed
- `@rarimo/nft-checkout` - Extended USDC token address for the Binance Smart Chain

## [1.5.0-rc.16] - 2023-05-23
### Changed
- `@rarimo/nft-checkout` - Extend token list for Ethereum, Binance Smart Chain to resolve target token by address got from backend

## [1.5.0-rc.15] - 2023-05-23
### Fixed
- `@rarimo/nft-checkout` - Checking decimals for non-zero for the payment token

## [1.5.0-rc.14] - 2023-05-22
### Added
- `@rarimo/nft-checkout` - Checking if payment token has liquidity pair with the target token

## [1.5.0-rc.13] - 2023-05-22
### Fixed
- `@rarimo/react-provider` - Calling clear handlers on non-existent provider
- `@rarimo/provider` - Extended `RuntimeEнфкrror` with `orginalError` field

## [1.5.0-rc.12] - 2023-05-17
### Fixed
- `@rarimo/nft-checkout`: Parsing of the balance received after multicall

## [1.5.0-rc.11] - 2023-05-16
### Added
- `@rarimo/react-nft-checkout`: getDestinationTx method into `DappContextProvider`

### Changed
- `@rarimo/nft-checkout`: Chain and token logos are stored locally

## [1.5.0-rc.10] - 2023-05-15
### Added
- `@rarimo/nft-checkout`: `NFTCheckoutOperation` status to track the operation status during the flow

## [1.5.0-rc.9] - 2023-05-12
### Added
- `root`: `@rarimo/providers-evm` package
- `root`: `@rarimo/providers-near` package
- `root`: `@rarimo/providers-solana` package

### Changed
- `@rarimo/provider`: Wallet wrappers split to the several packages: `@rarimo/providers-evm`, `@rarimo/providers-near`, `@rarimo/providers-solana`

### Fixed
- `@rarimo/nft-checkout`: Uniswap V3 token list url changed to the new one to omit gateway issues

## [1.5.0-rc.8] - 2023-04-25
### Added
- `all` - `browser` resolution path in the `package.json`

### Changed
- `@rarimo/nft-checkout` - Bump all `@distributedlab/web-kit` dependencies to 0.2.0-rc.2
- `all` - Migrate from `tsc` to `swc` to build packages
- `all` - Migrate from `ts-jest` to `swc-jest` to run tests

### Fixed
- `all` - Replace type imports with `import type` syntax according to the [SWC tsc migration guide]
- `all` - Moved exclude tests to the `tsconfig.build.json` file to make ESLint work in the tests

## Removed
- `root` - Unused `tsconfig.eslint.json`

[SWC tsc migration guide]: https://swc.rs/docs/migrating-from-tsc

## [1.5.0-rc.7] - 2023-04-21
### Added
- `@rarimo/nft-checkout`: `NFTCheckoutOperation.getDestinationTx` method
- `@rarimo/nft-checkout`: `@distributedlab/jac` dependency to perform JSON API requests

### Changed
- `root` - SDK now required Node.js version >= 18

### Fixed
- `@rarimo/react-nft-checkout`: Fetching token in the dev mode

## [1.5.0-rc.6] - 2023-04-19
### Added
- `@rarimo/provider`: `createProvider` options now accepts listener for provider change state events

### Changed
- `@rarimo/nft-checkout`: Bundle argument in `NFTCheckoutOperation.checkout` function is now optional
- `@rarimo/nft-checkout`: Avalanche C-Chain swap contract address
- `@rarimo/nft-checkout`: `recipient` field from the `Target` interface become optional
- `@rarimo/provider`: Refactored provider event bus payload to one type for all events

### Fixed
- `@rarimo/react-provider`: `useProvider` hook reactivity
- `@rarimo/nft-checkout`: Use of provided recipient address during building swap transaction
- `@rarimo/provider`: Emit of connect and disconnect events

### Removed
- `@rarimo/nft-checkout`: `address` field from the `Target` interface

## [1.5.0-rc.5] - 2023-03-30
### Added
- `@rarimo/nft-checkout`: Selectable token to swap
- `@rarimo/nft-checkout`: Disabled native token and wrapped native tokens

### Fixed
- `@rarimo/nft-checkout`: Automatic change chain
- `@rarimo/provider`: Automatic change chain
- `@rarimo/provider`: Load supported tokens

## [1.5.0-rc.4] - 2023-03-24
### Fixed
- `@rarimo/react-nft-checkout`: yarn.lock `jsbi` version

## [1.5.0-rc.3] - 2023-03-24
### Fixed
- `@rarimo/react-nft-checkout`: Trying to fix `jsbi` dependency issue, added `@uniswap/router-sdk` alias to the vite config to resolve esm module

## [1.5.0-rc.2] - 2023-03-24
### Added
- `@rarimo/react-nft-checkout`: `jsbi` dependency to cover `@uniswap/smart-order-router` peer-dependency

## [1.5.0-rc.1] - 2023-03-24
### Added
- `@rarimo/react-nft-checkout`: `NODE_ENV=production` to the build script to force Vite to resolve production modules
- `@rarimo/react-provider`: `NODE_ENV=production` to the build script force Vite to resolve production modules
- `root`: `apply-version` Script to easier bump version

### Fixed
- `@rarimo/react-nft-checkout`: Types path
- `@rarimo/react-nft-checkout`: npmignore
- `@rarimo/react-provider`: npmignore

## [1.5.0-rc.0] - 2023-03-23
### Added
- `@rarimo/react-nft-checkout`: React implementation of `@rarimo/nft-checkout` package
- `@rarimo/react-nft-checkout`: Exported UI component `RarimoPayButon`
- `@rarimo/react-nft-checkout`: Exported context provider `DappContextProvider` with core methods for NFT checkout

### Fixed
- `@rarimo/react-provider`: [near-api-js](https://github.com/vitejs/vite/issues/9703) vite build issue

## [1.4.0] - 2023-03-13
### Added
- `@rarimo/nft-checkout`: Mumbai chain swap contract address
- `@rarimo/nft-checkout`: Chapel test tokens
- `@rarimo/nft-checkout`: Throwing error if `swapTargetTokenSymbol` is native token, because it's not supported on the smart contracts side
- `@rarimo/react-provider`: React `@rarimo/provider` adapter package

### Changed
- `@rarimo/nft-checkout`: Fuji chain swap contract address
- `all`: Migrated to `@distributedlab/tools` from `@distributedlab/utils`
- `@rarimo/nft-checkout`: checkout method now return transaction hash string
- `@rarimo/nft-checkout`: Polygon support moved to the QuickSwap DEX
- `@rarimo/nft-checkout`: `@distributedlab/tools` package version bumped to `0.1.6`

### Fixed
- `@rarimo/nft-checkout`: Fix price calculation for estimates
- `@rarimo/provider`: Not changing provider state on events
- `@rarimo/provider`: Emitting provider change state events
- `@rarimo/nft-checkout`: Goerli and Sepolia names
- `@rarimo/nft-checkout`: Uniswap V3 native to erc20 path encoding
- `@rarimo/nft-checkout`: Multiple copies of the native token in the token list
- `all`: Typedoc export types

## [1.3.0] - 2023-03-03
### Added
- `all`: Build to CommonJS and ES modules
- `all`: `tsc-alias` package to use aliases in TypeScript
- `root`: `yarn rsc` Release Sanity Check script
- `root`: Publish to NPM GitHub Action
- `@rarimo/nft-checkout`: Mainnet contract to the chain list

### Fixed
- `@rarimo/provider`: Solflare wallet naming [issue](https://github.com/rarimo/js-sdk/issues/12)
- `@rarimo/nft-checkout`: Estimate swap for input native token

## [1.2.0] - 2023-02-28
### Added
- `root`: Yarn TypeScript plugin which automatically adds @types/ packages into your dependencies when you add a package that doesn't include its own types
- `@rarimo/provider`: Support of Phantom wallet
- `@rarimo/provider`: Support of Coinbase wallet
- `@rarimo/provider`: Support of Solflare wallet
- `@rarimo/provider`: Provider now implements `ProviderSubscriber` interface, which allows to subscribe to provider change state events
- `@rarimo/nft-checkout`: NFT checkout operation now implements `OperationSubscriber` interface, which allows to subscribe to operation change state events
- `@rarimo/nft-checkout`: `supportedTokens` method to `INFTCheckoutOperation` interface to get supported tokens for swap on the selected chain
- `@rarimo/nft-checkout`: PancakeSwap integration
- `@rarimo/nft-checkout`: Ability to provide slippage in target object
- `@rarimo/provider`: Support of Near wallet

### Changed
- `root`: Added some more info about SDK to the readme
- `all`: Moved all changelogs to the one file in the root of the repo
- `all`: Operator errors moved into from `@rarimo/provider` to `@rarimo/nft-checkout`
- `@rarimo/nft-checkout`: Target object now has the required field `swapTargetTokenSymbol`, which need to determine output token for swap.
- `@rarimo/nft-checkout`: Price type refactored to class, which provides developer friendly interface to create price instance

### Removed
- `root`: `esbuild` from dependencies
- `root`: `@babel/*` from dependencies to simplify and speed up build process
- `all`: `@/ -> ./src` aliases to remove `@babel/*` and all related packages
- `@rarimo/nft-checkout`: Swap contract addresses removed from EVM mainnet chains till they will be deployed
- `@rarimo/provider`: dependence on the web3

### Fixed
- `@rarimo/nft-checkout`: Swap for input native token

## [1.1.0] - 2023-02-20
### Added
- `@rarimo/nft-checkout`: `createCheckoutOperation` function simplifies create NFT checkout operation.
- `@rarimo/provider` -`createProvider` function, to simplify interface, which will create provider instance, user need to pass provider proxy implementation for needed wallet and web3 instance optionally.

### Changed
- `@rarimo/nft-checkout`: Moved to the new swap contracts
- `@rarimo/provider`: Provider initiation, now constructor accepts one proxy implementation instead of map
-
### Fixed
- `@rarimo/nft-checkout`: Approving non swap contract address, which cause error "transfer amount exceeds spender allowance"</li>

## [1.0.1] - 2023-02-16
### Added
- `@rarimo/nft-checkout`: `events` dependency to resolve a Node emulation issue for use in packagers such as Vite</li>

## [1.0.0] - 2023-02-16
### Under the hood changes
- Initiated repo with `@rarimo/provider` and `@rarimo/nft-checkout` packages

[Unreleased]: https://github.com/rarimo/js-sdk/compare/1.5.0-rc.18...HEAD
[1.5.0-rc.18]: https://github.com/rarimo/js-sdk/compare/1.5.0-rc.17...1.5.0-rc.18
[1.5.0-rc.17]: https://github.com/rarimo/js-sdk/compare/1.5.0-rc.16...1.5.0-rc.17
[1.5.0-rc.16]: https://github.com/rarimo/js-sdk/compare/1.5.0-rc.15...1.5.0-rc.16
[1.5.0-rc.15]: https://github.com/rarimo/js-sdk/compare/1.5.0-rc.14...1.5.0-rc.15
[1.5.0-rc.14]: https://github.com/rarimo/js-sdk/compare/1.5.0-rc.13...1.5.0-rc.14
[1.5.0-rc.13]: https://github.com/rarimo/js-sdk/compare/1.5.0-rc.12...1.5.0-rc.13
[1.5.0-rc.12]: https://github.com/rarimo/js-sdk/compare/1.5.0-rc.11...1.5.0-rc.12
[1.5.0-rc.11]: https://github.com/rarimo/js-sdk/compare/1.5.0-rc.10...1.5.0-rc.11
[1.5.0-rc.10]: https://github.com/rarimo/js-sdk/compare/1.5.0-rc.9...1.5.0-rc.10
[1.5.0-rc.9]: https://github.com/rarimo/js-sdk/compare/1.5.0-rc.8...1.5.0-rc.9
[1.5.0-rc.8]: https://github.com/rarimo/js-sdk/compare/1.5.0-rc.7...1.5.0-rc.8
[1.5.0-rc.7]: https://github.com/rarimo/js-sdk/compare/1.5.0-rc.6...1.5.0-rc.7
[1.5.0-rc.6]: https://github.com/rarimo/js-sdk/compare/1.5.0-rc.5...1.5.0-rc.6
[1.5.0-rc.5]: https://github.com/rarimo/js-sdk/compare/1.5.0-rc.4...1.5.0-rc.5
[1.5.0-rc.4]: https://github.com/rarimo/js-sdk/compare/1.5.0-rc.3...1.5.0-rc.4
[1.5.0-rc.3]: https://github.com/rarimo/js-sdk/compare/1.5.0-rc.2...1.5.0-rc.3
[1.5.0-rc.2]: https://github.com/rarimo/js-sdk/compare/1.5.0-rc.1...1.5.0-rc.2
[1.5.0-rc.1]: https://github.com/rarimo/js-sdk/compare/1.5.0-rc.0...1.5.0-rc.1
[1.5.0-rc.0]: https://github.com/rarimo/js-sdk/compare/1.4.0...1.5.0-rc.0
[1.4.0]: https://github.com/rarimo/js-sdk/compare/1.3.0...1.4.0
[1.3.0]: https://github.com/rarimo/js-sdk/compare/1.2.0...1.3.0
[1.2.0]: https://github.com/rarimo/js-sdk/compare/1.1.0...1.2.0
[1.1.0]: https://github.com/rarimo/js-sdk/compare/1.0.1...1.1.0
[1.0.1]: https://github.com/rarimo/js-sdk/compare/1.0.0...1.0.1
[1.0.0]: https://github.com/rarimo/js-sdk/releases/tag/1.0.0

## Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### Fixed
- `@rarimo/provider`: Solflare wallet naming [issue](https://github.com/rarimo/js-sdk/issues/12)

## 1.2.0 - 2023-02-28
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

## 1.1.0 - 2023-02-20
### Added
 - `@rarimo/nft-checkout`: `createCheckoutOperation` function simplifies create NFT checkout operation.
 - `@rarimo/provider` -`createProvider` function, to simplify interface, which will create provider instance, user need to pass provider proxy implementation for needed wallet and web3 instance optionally.

### Changed
- `@rarimo/nft-checkout`: Moved to the new swap contracts
- `@rarimo/provider`: Provider initiation, now constructor accepts one proxy implementation instead of map

### Fixed
- `@rarimo/nft-checkout`: Approving non swap contract address, which cause error "transfer amount exceeds spender allowance"</li>

## 1.0.1 - 2023-02-16
### Added
- `@rarimo/nft-checkout`: `events` dependency to resolve a Node emulation issue for use in packagers such as Vite</li>

## 1.0.0
### Under the hood changes
- Initiated repo with `@rarimo/provider` and `@rarimo/nft-checkout` packages


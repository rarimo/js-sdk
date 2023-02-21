# @rarimo/nft-checkout
The @rarimo/nft-checkout TypeScript package with cross-chain NFT purchases functionality, based on Rarimo Protocol.

![version (scoped package)](https://badgen.net/npm/v/@rarimo/nft-checkout)
![types](https://badgen.net/npm/types/@rarimo/nft-checkout)
![tree-shaking](https://badgen.net/bundlephobia/tree-shaking/@rarimo/nft-checkout)
![checks](https://badgen.net/github/checks/distributed-lab/web-kit/main)

## Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

<details><summary>1.2.0</summary>
  <h4>Added</h4>
  <ul>
    <li>`supportedTokens` method to `INFTCheckoutOperation` interface to get supported tokens for swap on the selected chain</li>
    <li>PancakeSwap integration</li>
    <li>Ability to provide slippage in target object</li>
  </ul>
  <h4>Changed</h4>
  <ul>
    <li>Operator errors moved into from `@rarimo/provider`</li>
    <li>Target object now has the required field `swapTargetTokenSymbol`, which need to determine output token for swap.</li>
    <li>Price type refactored to class, which provides developer friendly interface to create price instance</li>
  </ul>
  <h4>Fixed</h4>
  <ul>
    <li>Swap for input native token</li>
  </ul>
</details>
<details><summary>1.1.0</summary>
  <h4>Added</h4>
  <ul>
    <li>`createCheckoutOperation` function simplifies create NFT checkout operation.</li>
  </ul>
  <h4>Changed</h4>
  <ul>
    <li>Moved to the new swap contracts</li>
  </ul>
  <h4>Fixed</h4>
  <ul>
    <li>Approving non swap contract address, which cause error "transfer amount exceeds spender allowance"</li>
  </ul>
</details>
<details><summary>1.0.1</summary>
  <h4>Added</h4>
  <ul>
    <li>`events` dependency to resolve a Node emulation issue for use in packagers such as Vite</li>
  </ul>
</details>
<details><summary>1.0.0</summary>
  <h4>Under the hood changes</h4>
  <ul>
    <li>Initiated package</li>
  </ul>
</details>


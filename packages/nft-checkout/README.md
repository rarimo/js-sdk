# @rarimo/nft-checkout
Features of the Rarimo SDK that create cross-chain transactions, based on the Rarimo protocol.

![version (scoped package)](https://badgen.net/npm/v/@rarimo/nft-checkout)
![types](https://badgen.net/npm/types/@rarimo/nft-checkout)
![tree-shaking](https://badgen.net/bundlephobia/tree-shaking/@rarimo/nft-checkout)
![checks](https://badgen.net/github/checks/distributed-lab/web-kit/main)

## Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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


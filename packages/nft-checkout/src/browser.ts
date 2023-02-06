/**
 * This file is the entrypoint of browser builds.
 * The code executes when loaded in a browser.
 */
import * as nftCheckout from './index'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(window as any).RarimoNFTCheckout = nftCheckout

console.warn('Rarimo NFT Checkout was added to the window object.')

/**
 * This file is the entrypoint of browser builds.
 * The code executes when loaded in a browser.
 */
import * as rarimoProvider from './index'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(window as any).RarimoProvider = rarimoProvider

console.warn('Rarimo Provider was added to the window object.')

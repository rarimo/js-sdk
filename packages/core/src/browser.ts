/**
 * This file is the entrypoint of browser builds.
 * The code executes when loaded in a browser.
 */
import * as rarimoCore from './index'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(window as any).RarimoCore = rarimoCore

console.warn('Rarimo Core was added to the window object.')

import { ExternalProvider as EthereumProvider } from '@ethersproject/providers'

/**
 * Non defined provider from browser
 */
export type Provider = EthereumProvider | unknown

export type JsonRPCUrlMap = { [chainName: string]: string }

import type { ChainInfo, Window as KeplrWindow } from '@keplr-wallet/types'

import { WalletExtensionNotInstalledError } from '@/errors'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Window extends KeplrWindow {}
}

export const getKeplrDirectSigner = async (chainInfo: ChainInfo) => {
  if (window.keplr === undefined) throw new WalletExtensionNotInstalledError()

  await window.keplr.experimentalSuggestChain(chainInfo)
  await window.keplr.enable(chainInfo.chainId)

  return window.keplr.getOfflineSigner(chainInfo.chainId)
}

export const getKeplrAminoSigner = async (chainInfo: ChainInfo) => {
  if (window.keplr === undefined) throw new WalletExtensionNotInstalledError()

  await window.keplr.experimentalSuggestChain(chainInfo)
  await window.keplr.enable(chainInfo.chainId)

  return window.keplr.getOfflineSignerOnlyAmino(chainInfo.chainId)
}

export const getKeplrSigner = async (chainInfo: ChainInfo) => {
  if (window.keplr === undefined) throw new WalletExtensionNotInstalledError()

  await window.keplr.experimentalSuggestChain(chainInfo)
  await window.keplr.enable(chainInfo.chainId)

  return window.keplr.getOfflineSignerAuto(chainInfo.chainId)
}

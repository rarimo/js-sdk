import type { OfflineSigner } from '@cosmjs/proto-signing'
import type { ChainInfo, Window as KeplrWindow } from '@keplr-wallet/types'

import { WalletExtensionNotInstalledError } from '@/errors'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Window extends KeplrWindow {}
}

const enableKeplr = async (chain: ChainInfo) => {
  if (!window.keplr) throw new WalletExtensionNotInstalledError()

  await window.keplr.experimentalSuggestChain(chain)
  await window.keplr.enable(chain.chainId)
}

export const getKeplrDirectSigner = async (chain: ChainInfo) => {
  await enableKeplr(chain)

  return window.keplr!.getOfflineSigner(chain.chainId)
}

export const getKeplrAminoSigner = async (chain: ChainInfo) => {
  await enableKeplr(chain)

  return window.keplr!.getOfflineSignerOnlyAmino(chain.chainId)
}

export const getKeplrSigner = async (chain: ChainInfo) => {
  await enableKeplr(chain)

  return (await window.keplr!.getOfflineSignerAuto(
    chain.chainId,
  )) as OfflineSigner
}

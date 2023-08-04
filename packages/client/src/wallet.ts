import type { OfflineSigner } from '@cosmjs/proto-signing'
import { computed, ref, toRaw } from '@distributedlab/reactivity'
import type {
  AccountData,
  ChainInfo,
  Window as KeplrWindow,
} from '@keplr-wallet/types'

import { WalletExtensionNotInstalledError, WalletIsEmptyError } from '@/errors'
import { stub } from '@/helpers'
import type { Wallet } from '@/types'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Window extends KeplrWindow {}
}

const initStub = stub('Wallet not initialized!')

export const makeWallet = (): Wallet => {
  const signer = ref<OfflineSigner>(initStub)
  const accounts = ref<readonly AccountData[]>(initStub)
  const chainId = ref('')

  const isEmpty = computed(() => !signer.value || !chainId.value)

  const account = computed(() => {
    if (isEmpty.value || !accounts.value?.[0]) throw new WalletIsEmptyError()
    return accounts.value[0]
  })

  const address = computed(() => {
    return account.value.address
  })

  const connect = async (chainInfo: ChainInfo) => {
    if (window.keplr === undefined) throw new WalletExtensionNotInstalledError()
    chainId.value = chainInfo.chainId

    await window.keplr.experimentalSuggestChain(chainInfo)

    // TODO: does this needed ?
    window.keplr.defaultOptions = {
      sign: {
        preferNoSetFee: true,
        preferNoSetMemo: true,
      },
    }

    await window.keplr.enable(chainId.value)
    signer.value = window.keplr.getOfflineSigner(chainId.value)
    accounts.value = await signer.value.getAccounts()
  }

  const disconnect = () => {
    signer.value = initStub
    accounts.value = initStub
    chainId.value = ''
  }

  return toRaw({
    signer,
    accounts,
    chainId,
    isEmpty,
    account,
    address,
    connect,
    disconnect,
  })
}

import type { OfflineSigner } from '@cosmjs/proto-signing'
import { computed, ref, toRaw } from '@distributedlab/reactivity'
import type { AccountData, ChainInfo } from '@keplr-wallet/types'

import { WalletIsEmptyError } from '@/errors'
import { getKeplrSigner, stub } from '@/helpers'
import type { Wallet } from '@/types'

const initStub = stub('Wallet not initialized!')

export const makeWallet = (injectedSigner?: OfflineSigner): Wallet => {
  const signer = ref<OfflineSigner>(initStub)
  const accounts = ref<readonly AccountData[]>(initStub)
  const chainId = ref('')

  const isEmpty = computed(() => !signer.value || !chainId.value)

  const account = computed(() => {
    if (isEmpty.value || !accounts.value?.[0]) throw new WalletIsEmptyError()
    return accounts.value[0]
  })

  const address = computed(() => {
    return account.value?.address ?? ''
  })

  const connect = async (chainInfo: ChainInfo) => {
    signer.value = injectedSigner || (await getKeplrSigner(chainInfo))

    chainId.value = chainInfo.chainId
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

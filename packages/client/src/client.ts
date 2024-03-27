import { ref, toRaw } from '@distributedlab/reactivity'

import { getChainInfo as _getChainInfo, stub } from '@/helpers'

import { makeRarimoBroadcaster } from './broadcaster'
import { makeRarimoQuerier } from './querier'
import type {
  Config,
  RarimoBroadcaster,
  RarimoClient,
  RarimoQuerier,
  Wallet,
} from './types'
import { makeWallet } from './wallet'

export const makeRarimoClient = (config: Config): RarimoClient => {
  const wallet = ref<Wallet>(stub('Wallet not initialized!'))
  const query = ref<RarimoQuerier>(makeRarimoQuerier(config))
  const tx = ref<RarimoBroadcaster>(stub('Broadcaster not initialized!'))

  const disconnect = () => {
    tx.value.disconnect()
    wallet.value.disconnect()
  }

  const getChainInfo = async () => {
    return _getChainInfo(config, query.value)
  }

  const connect = async (injectedWallet?: Wallet) => {
    const chainInfo = await getChainInfo()
    const _wallet = injectedWallet || makeWallet()

    await _wallet.connect(chainInfo)
    wallet.value = _wallet

    tx.value = await makeRarimoBroadcaster(config, _wallet)
  }

  return toRaw({
    config,
    wallet,
    disconnect,
    connect,
    getChainInfo,
    query,
    tx,
  })
}

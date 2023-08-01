import { ref, toRaw } from '@distributedlab/reactivity'

import { stub } from '@/helpers'

import { makeRarimoBroadcaster } from './broadcaster'
import { getChainInfo } from './helpers'
import { makeRarimoQuerier } from './querier'
import type {
  Config,
  RarimoBroadcaster,
  RarimoClient,
  RarimoQuerier,
  Wallet,
} from './types'
import { makeWallet } from './wallet'

export const makeRarimoClient = async (
  config: Config,
): Promise<RarimoClient> => {
  const wallet = ref<Wallet>(stub('Wallet not initialized!'))
  const query = ref<RarimoQuerier>(stub('Querier not initialized!'))
  const tx = ref<RarimoBroadcaster>(stub('Broadcaster not initialized!'))

  const init = async () => {
    query.value = await makeRarimoQuerier(config)
  }

  await init()

  const disconnect = () => {
    tx.value.disconnect()
    wallet.value.disconnect()
  }

  const connect = async () => {
    const chainInfo = await getChainInfo(config, query.value)
    const _wallet = makeWallet()
    await _wallet.connect(chainInfo)
    wallet.value = _wallet
    tx.value = await makeRarimoBroadcaster(config, _wallet)
  }

  return toRaw({
    config,
    wallet,
    disconnect,
    connect,
    query,
    tx,
  })
}

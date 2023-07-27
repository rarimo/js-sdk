import { stub } from '@/helpers'

import { makeBroadcaster } from './broadcaster'
import { getChainInfo } from './helpers'
import { makeQuerier } from './querier'
import type { Config, RarimoClient, Wallet } from './types'
import { makeWallet } from './wallet'

export const makeRarimoClient = async (
  config: Config,
): Promise<RarimoClient> => {
  let wallet: Wallet = stub('Wallet not initialized!')
  let querier = stub('Querier not initialized!')
  let broadcaster = stub('Broadcaster not initialized!')

  const init = async () => {
    querier = await makeQuerier(config)
  }

  await init()

  const disconnect = () => {
    broadcaster.disconnect()
    wallet.disconnect()
  }

  const connect = async () => {
    const chainInfo = await getChainInfo(config, querier)
    const _wallet = makeWallet()
    await _wallet.connect(chainInfo)
    wallet = _wallet
    broadcaster = await makeBroadcaster(config, _wallet)
  }

  return {
    config,
    wallet,
    ...querier,
    ...broadcaster,
    disconnect,
    connect,
  }
}

import type { BroadcastTxFailure } from '@cosmjs/launchpad'
import {
  type EncodeObject,
  type GeneratedType,
  Registry,
} from '@cosmjs/proto-signing/build/registry'
import { type DeliverTxResponse, SigningStargateClient } from '@cosmjs/stargate'

import { WalletBroadcastError } from '@/errors'
import type { Config, Wallet } from '@/types'

import { stub } from './stub'

export const makeBroadcastMaker = async (config: Config, wallet: Wallet) => {
  let stargate: SigningStargateClient = stub('Stargate not initialized!')
  const stargateRegistry = new Registry()

  const init = async () => {
    const _stargate = await SigningStargateClient.connectWithSigner(
      config.rpcUrl,
      wallet.signer,
      { registry: stargateRegistry as never },
    )

    if (!_stargate) return

    stargate = _stargate
  }

  const disconnect = () => {
    stargate.disconnect()
    stargate = stub('Stargate not initialized!')
  }

  const signAndBroadcast = async (messages: EncodeObject[]) => {
    const res = await stargate.signAndBroadcast(
      wallet.account.address,
      messages,
      // TODO: check this
      {
        amount: [{ denom: config.currency.minDenom, amount: '200000' }],
        gas: '2000000',
      },
    )

    if (!res || ('code' in res && res.code !== 0)) {
      throw new WalletBroadcastError(res as BroadcastTxFailure)
    }

    return res
  }

  const makeBroadcastCaller = <T>(
    typeUrl: string,
    type: GeneratedType,
  ): ((msg: T) => Promise<DeliverTxResponse>) => {
    stargateRegistry.register(typeUrl, type)
    return (msg: T): Promise<DeliverTxResponse> => {
      return signAndBroadcast([{ typeUrl, value: msg }])
    }
  }

  await init()

  return {
    disconnect,
    makeBroadcastCaller,
  }
}

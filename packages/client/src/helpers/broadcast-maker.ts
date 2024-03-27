import type { BroadcastTxFailure } from '@cosmjs/launchpad'
import { decodePubkey } from '@cosmjs/proto-signing'
import {
  type EncodeObject,
  type GeneratedType,
  Registry,
} from '@cosmjs/proto-signing/build/registry'
import {
  type Account,
  AminoTypes,
  createDefaultAminoConverters,
  type DeliverTxResponse,
  GasPrice,
  SigningStargateClient,
} from '@cosmjs/stargate'

import { BaseAccount } from '@/codec/cosmos/auth/auth'
import { EthAccount } from '@/codec/ethermint/account'
import { WalletBroadcastError } from '@/errors'
import { createAuthzAminoConverters } from '@/helpers'
import type { Config, Wallet } from '@/types'

import { stub } from './stub'

export const makeBroadcastMaker = async (config: Config, wallet: Wallet) => {
  let stargate: SigningStargateClient = stub('Stargate not initialized!')
  const stargateRegistry = new Registry()

  const init = async () => {
    const _stargate = await SigningStargateClient.connectWithSigner(
      config.rpcUrl,
      wallet.signer,
      {
        registry: stargateRegistry as never,
        gasPrice: GasPrice.fromString(
          `${config.gasPrice.amount}${config.currency.minDenom}`,
        ),
        accountParser: acc => {
          if (acc.typeUrl === '/cosmos.auth.v1beta1.BaseAccount') {
            return baseAccountToAccount(BaseAccount.decode(acc.value))
          }
          return baseAccountToAccount(EthAccount.decode(acc.value).baseAccount!)
        },
        aminoTypes: new AminoTypes({
          ...createDefaultAminoConverters(),
          ...createAuthzAminoConverters(stargateRegistry),
        }),
      },
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
      'auto',
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
    stargateRegistry,
  }
}

const baseAccountToAccount = (base: BaseAccount): Account => {
  return {
    address: base.address,
    accountNumber: base.accountNumber,
    sequence: base.sequence,
    pubkey: base.pubKey ? decodePubkey(base.pubKey) : null,
  }
}

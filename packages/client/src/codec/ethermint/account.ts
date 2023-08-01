/* eslint-disable */
import _m0 from 'protobufjs/minimal'

import {
  BaseAccount,
  type DeepPartial,
  type Exact,
} from '@/codec/cosmos/auth/auth'
import { isSet } from "@/codec/helpers";

export interface EthAccount {
  baseAccount: BaseAccount | undefined
  codeHash: string
}

function createBaseEthAccount(): EthAccount {
  return { baseAccount: undefined, codeHash: '' }
}

export const EthAccount = {
  encode(
    message: EthAccount,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.baseAccount !== undefined) {
      BaseAccount.encode(message.baseAccount, writer.uint32(10).fork()).ldelim()
    }
    if (message.codeHash !== '') {
      writer.uint32(18).string(message.codeHash)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): EthAccount {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    const end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseEthAccount()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.baseAccount = BaseAccount.decode(reader, reader.uint32())
          break
        case 2:
          message.codeHash = reader.string()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): EthAccount {
    return {
      baseAccount: isSet(object.baseAccount)
        ? BaseAccount.fromJSON(object.baseAccount)
        : undefined,
      codeHash: isSet(object.codeHash) ? String(object.codeHash) : '',
    }
  },

  toJSON(message: EthAccount): unknown {
    const obj: any = {}
    message.baseAccount !== undefined &&
      (obj.baseAccount = message.baseAccount
        ? BaseAccount.toJSON(message.baseAccount)
        : undefined)
    message.codeHash !== undefined && (obj.codeHash = message.codeHash)
    return obj
  },

  fromPartial<I extends Exact<DeepPartial<EthAccount>, I>>(
    object: I,
  ): EthAccount {
    const message = createBaseEthAccount()
    message.baseAccount =
      object.baseAccount !== undefined && object.baseAccount !== null
        ? BaseAccount.fromPartial(object.baseAccount)
        : undefined
    message.codeHash = object.codeHash ?? ''
    return message
  },
}

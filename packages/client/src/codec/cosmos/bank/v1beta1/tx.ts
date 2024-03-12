/* eslint-disable */
import _m0 from 'protobufjs/minimal'

import { type DeepPartial, type Exact, isSet } from '@/codec/helpers'

import { Coin } from '../../base/v1beta1/coin'

export const protobufPackage = 'cosmos.bank.v1beta1'

/** MsgSend represents a message to send coins from one account to another. */
export interface MsgSend {
  fromAddress: string
  toAddress: string
  amount: Coin[]
}

function createBaseMsgSend(): MsgSend {
  return { fromAddress: '', toAddress: '', amount: [] }
}

export const MsgSend = {
  encode(
    message: MsgSend,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.fromAddress !== '') {
      writer.uint32(10).string(message.fromAddress)
    }
    if (message.toAddress !== '') {
      writer.uint32(18).string(message.toAddress)
    }
    for (const v of message.amount) {
      Coin.encode(v!, writer.uint32(26).fork()).ldelim()
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgSend {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    const end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseMsgSend()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.fromAddress = reader.string()
          break
        case 2:
          message.toAddress = reader.string()
          break
        case 3:
          message.amount.push(Coin.decode(reader, reader.uint32()))
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): MsgSend {
    return {
      fromAddress: isSet(object.fromAddress) ? String(object.fromAddress) : '',
      toAddress: isSet(object.toAddress) ? String(object.toAddress) : '',
      amount: Array.isArray(object?.amount)
        ? object.amount.map((e: any) => Coin.fromJSON(e))
        : [],
    }
  },

  toJSON(message: MsgSend): unknown {
    const obj: any = {}
    message.fromAddress !== undefined && (obj.fromAddress = message.fromAddress)
    message.toAddress !== undefined && (obj.toAddress = message.toAddress)
    if (message.amount) {
      obj.amount = message.amount.map(e => (e ? Coin.toJSON(e) : undefined))
    } else {
      obj.amount = []
    }
    return obj
  },

  fromPartial<I extends Exact<DeepPartial<MsgSend>, I>>(object: I): MsgSend {
    const message = createBaseMsgSend()
    message.fromAddress = object.fromAddress ?? ''
    message.toAddress = object.toAddress ?? ''
    message.amount = object.amount?.map(e => Coin.fromPartial(e)) || []
    return message
  },
}

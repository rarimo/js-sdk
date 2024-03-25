import type { AminoMsg } from '@cosmjs/amino'
import { Registry } from '@cosmjs/proto-signing/build/registry'
import {
  type AminoConverter,
  AminoTypes,
  createDefaultAminoConverters,
} from '@cosmjs/stargate'

import { MsgExec } from '@/codec/cosmos/authz/v1beta1/tx'
import { MessageTypeUrls } from '@/enums'

// TODO: https://github.com/likecoin/iscn-js/blob/1ac7fb6f3b568e0d35e598442769a283c669c34b/src/messages/authz.ts#L98
export function createAuthzAminoConverters(
  stargateRegistry: Registry,
): Record<string, AminoConverter> {
  const aminoTypes = new AminoTypes({
    ...createDefaultAminoConverters(),
  })

  return {
    [MessageTypeUrls.Exec]: {
      aminoType: 'cosmos-sdk/MsgExec',
      toAmino: ({
        msgs,
        grantee,
      }: MsgExec): {
        grantee: string
        msgs: AminoMsg[]
      } => {
        return {
          msgs: msgs.map(msg => {
            return aminoTypes.toAmino({
              typeUrl: msg.typeUrl,
              value: stargateRegistry.decode({
                typeUrl: msg.typeUrl,
                value: msg.value,
              }),
            })
          }),
          grantee,
        }
      },
      /* eslint-disable camelcase */
      fromAmino: ({
        msgs,
        grantee,
      }: {
        grantee: string
        msgs: AminoMsg[]
      }): MsgExec =>
        MsgExec.fromPartial({
          msgs: msgs.map(msg => {
            const res = aminoTypes.fromAmino(msg)

            return {
              typeUrl: res.typeUrl,
              value: stargateRegistry.encode({
                typeUrl: res.typeUrl,
                value: res.value,
              }),
            }
          }),
          grantee,
        }),
    },
  }
}

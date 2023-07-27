/* eslint-disable */
import _m0 from "protobufjs/minimal";

export const protobufPackage = "rarimo.rarimocore.rarimocore";

export interface UnfreezeSignerPartyProposal {
  title: string;
  description: string;
  account: string;
}

export interface ReshareKeysProposal {
  title: string;
  description: string;
}

export interface SlashProposal {
  title: string;
  description: string;
  party: string;
}

export interface DropPartiesProposal {
  title: string;
  description: string;
}

function createBaseUnfreezeSignerPartyProposal(): UnfreezeSignerPartyProposal {
  return { title: "", description: "", account: "" };
}

export const UnfreezeSignerPartyProposal = {
  encode(message: UnfreezeSignerPartyProposal, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.title !== "") {
      writer.uint32(10).string(message.title);
    }
    if (message.description !== "") {
      writer.uint32(18).string(message.description);
    }
    if (message.account !== "") {
      writer.uint32(26).string(message.account);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UnfreezeSignerPartyProposal {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUnfreezeSignerPartyProposal();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.title = reader.string();
          break;
        case 2:
          message.description = reader.string();
          break;
        case 3:
          message.account = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UnfreezeSignerPartyProposal {
    return {
      title: isSet(object.title) ? String(object.title) : "",
      description: isSet(object.description) ? String(object.description) : "",
      account: isSet(object.account) ? String(object.account) : "",
    };
  },

  toJSON(message: UnfreezeSignerPartyProposal): unknown {
    const obj: any = {};
    message.title !== undefined && (obj.title = message.title);
    message.description !== undefined && (obj.description = message.description);
    message.account !== undefined && (obj.account = message.account);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<UnfreezeSignerPartyProposal>, I>>(object: I): UnfreezeSignerPartyProposal {
    const message = createBaseUnfreezeSignerPartyProposal();
    message.title = object.title ?? "";
    message.description = object.description ?? "";
    message.account = object.account ?? "";
    return message;
  },
};

function createBaseReshareKeysProposal(): ReshareKeysProposal {
  return { title: "", description: "" };
}

export const ReshareKeysProposal = {
  encode(message: ReshareKeysProposal, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.title !== "") {
      writer.uint32(10).string(message.title);
    }
    if (message.description !== "") {
      writer.uint32(18).string(message.description);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ReshareKeysProposal {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseReshareKeysProposal();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.title = reader.string();
          break;
        case 2:
          message.description = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ReshareKeysProposal {
    return {
      title: isSet(object.title) ? String(object.title) : "",
      description: isSet(object.description) ? String(object.description) : "",
    };
  },

  toJSON(message: ReshareKeysProposal): unknown {
    const obj: any = {};
    message.title !== undefined && (obj.title = message.title);
    message.description !== undefined && (obj.description = message.description);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ReshareKeysProposal>, I>>(object: I): ReshareKeysProposal {
    const message = createBaseReshareKeysProposal();
    message.title = object.title ?? "";
    message.description = object.description ?? "";
    return message;
  },
};

function createBaseSlashProposal(): SlashProposal {
  return { title: "", description: "", party: "" };
}

export const SlashProposal = {
  encode(message: SlashProposal, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.title !== "") {
      writer.uint32(10).string(message.title);
    }
    if (message.description !== "") {
      writer.uint32(18).string(message.description);
    }
    if (message.party !== "") {
      writer.uint32(26).string(message.party);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SlashProposal {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSlashProposal();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.title = reader.string();
          break;
        case 2:
          message.description = reader.string();
          break;
        case 3:
          message.party = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): SlashProposal {
    return {
      title: isSet(object.title) ? String(object.title) : "",
      description: isSet(object.description) ? String(object.description) : "",
      party: isSet(object.party) ? String(object.party) : "",
    };
  },

  toJSON(message: SlashProposal): unknown {
    const obj: any = {};
    message.title !== undefined && (obj.title = message.title);
    message.description !== undefined && (obj.description = message.description);
    message.party !== undefined && (obj.party = message.party);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<SlashProposal>, I>>(object: I): SlashProposal {
    const message = createBaseSlashProposal();
    message.title = object.title ?? "";
    message.description = object.description ?? "";
    message.party = object.party ?? "";
    return message;
  },
};

function createBaseDropPartiesProposal(): DropPartiesProposal {
  return { title: "", description: "" };
}

export const DropPartiesProposal = {
  encode(message: DropPartiesProposal, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.title !== "") {
      writer.uint32(10).string(message.title);
    }
    if (message.description !== "") {
      writer.uint32(18).string(message.description);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DropPartiesProposal {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDropPartiesProposal();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.title = reader.string();
          break;
        case 2:
          message.description = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): DropPartiesProposal {
    return {
      title: isSet(object.title) ? String(object.title) : "",
      description: isSet(object.description) ? String(object.description) : "",
    };
  },

  toJSON(message: DropPartiesProposal): unknown {
    const obj: any = {};
    message.title !== undefined && (obj.title = message.title);
    message.description !== undefined && (obj.description = message.description);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<DropPartiesProposal>, I>>(object: I): DropPartiesProposal {
    const message = createBaseDropPartiesProposal();
    message.title = object.title ?? "";
    message.description = object.description ?? "";
    return message;
  },
};

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}

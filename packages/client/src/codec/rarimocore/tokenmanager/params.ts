/* eslint-disable */
import _m0 from "protobufjs/minimal";
import { Any } from "../../google/protobuf/any";

export const protobufPackage = "rarimo.rarimocore.tokenmanager";

export enum NetworkType {
  EVM = 0,
  Solana = 1,
  Near = 2,
  Other = 3,
  UNRECOGNIZED = -1,
}

export function networkTypeFromJSON(object: any): NetworkType {
  switch (object) {
    case 0:
    case "EVM":
      return NetworkType.EVM;
    case 1:
    case "Solana":
      return NetworkType.Solana;
    case 2:
    case "Near":
      return NetworkType.Near;
    case 3:
    case "Other":
      return NetworkType.Other;
    case -1:
    case "UNRECOGNIZED":
    default:
      return NetworkType.UNRECOGNIZED;
  }
}

export function networkTypeToJSON(object: NetworkType): string {
  switch (object) {
    case NetworkType.EVM:
      return "EVM";
    case NetworkType.Solana:
      return "Solana";
    case NetworkType.Near:
      return "Near";
    case NetworkType.Other:
      return "Other";
    case NetworkType.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export enum NetworkParamType {
  BRIDGE = 0,
  FEE = 1,
  IDENTITY = 2,
  UNRECOGNIZED = -1,
}

export function networkParamTypeFromJSON(object: any): NetworkParamType {
  switch (object) {
    case 0:
    case "BRIDGE":
      return NetworkParamType.BRIDGE;
    case 1:
    case "FEE":
      return NetworkParamType.FEE;
    case 2:
    case "IDENTITY":
      return NetworkParamType.IDENTITY;
    case -1:
    case "UNRECOGNIZED":
    default:
      return NetworkParamType.UNRECOGNIZED;
  }
}

export function networkParamTypeToJSON(object: NetworkParamType): string {
  switch (object) {
    case NetworkParamType.BRIDGE:
      return "BRIDGE";
    case NetworkParamType.FEE:
      return "FEE";
    case NetworkParamType.IDENTITY:
      return "IDENTITY";
    case NetworkParamType.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface Network {
  /** network name */
  name: string;
  type: NetworkType;
  params: NetworkParams[];
}

export interface NetworkParams {
  type: NetworkParamType;
  /** Corresponding to type details */
  details: Any | undefined;
}

export interface BridgeNetworkParams {
  contract: string;
}

export interface FeeNetworkParams {
  contract: string;
  feeTokens: FeeToken[];
}

export interface IdentityNetworkParams {
  contract: string;
}

export interface FeeToken {
  /** contract address hex */
  contract: string;
  amount: string;
}

/** Params defines the parameters for the module. */
export interface Params {
  networks: Network[];
}

function createBaseNetwork(): Network {
  return { name: "", type: 0, params: [] };
}

export const Network = {
  encode(message: Network, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.name !== "") {
      writer.uint32(10).string(message.name);
    }
    if (message.type !== 0) {
      writer.uint32(16).int32(message.type);
    }
    for (const v of message.params) {
      NetworkParams.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Network {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseNetwork();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.name = reader.string();
          break;
        case 2:
          message.type = reader.int32() as any;
          break;
        case 3:
          message.params.push(NetworkParams.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Network {
    return {
      name: isSet(object.name) ? String(object.name) : "",
      type: isSet(object.type) ? networkTypeFromJSON(object.type) : 0,
      params: Array.isArray(object?.params) ? object.params.map((e: any) => NetworkParams.fromJSON(e)) : [],
    };
  },

  toJSON(message: Network): unknown {
    const obj: any = {};
    message.name !== undefined && (obj.name = message.name);
    message.type !== undefined && (obj.type = networkTypeToJSON(message.type));
    if (message.params) {
      obj.params = message.params.map((e) => e ? NetworkParams.toJSON(e) : undefined);
    } else {
      obj.params = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Network>, I>>(object: I): Network {
    const message = createBaseNetwork();
    message.name = object.name ?? "";
    message.type = object.type ?? 0;
    message.params = object.params?.map((e) => NetworkParams.fromPartial(e)) || [];
    return message;
  },
};

function createBaseNetworkParams(): NetworkParams {
  return { type: 0, details: undefined };
}

export const NetworkParams = {
  encode(message: NetworkParams, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.type !== 0) {
      writer.uint32(8).int32(message.type);
    }
    if (message.details !== undefined) {
      Any.encode(message.details, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): NetworkParams {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseNetworkParams();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.type = reader.int32() as any;
          break;
        case 2:
          message.details = Any.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): NetworkParams {
    return {
      type: isSet(object.type) ? networkParamTypeFromJSON(object.type) : 0,
      details: isSet(object.details) ? Any.fromJSON(object.details) : undefined,
    };
  },

  toJSON(message: NetworkParams): unknown {
    const obj: any = {};
    message.type !== undefined && (obj.type = networkParamTypeToJSON(message.type));
    message.details !== undefined && (obj.details = message.details ? Any.toJSON(message.details) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<NetworkParams>, I>>(object: I): NetworkParams {
    const message = createBaseNetworkParams();
    message.type = object.type ?? 0;
    message.details = (object.details !== undefined && object.details !== null)
      ? Any.fromPartial(object.details)
      : undefined;
    return message;
  },
};

function createBaseBridgeNetworkParams(): BridgeNetworkParams {
  return { contract: "" };
}

export const BridgeNetworkParams = {
  encode(message: BridgeNetworkParams, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.contract !== "") {
      writer.uint32(10).string(message.contract);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): BridgeNetworkParams {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBridgeNetworkParams();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.contract = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): BridgeNetworkParams {
    return { contract: isSet(object.contract) ? String(object.contract) : "" };
  },

  toJSON(message: BridgeNetworkParams): unknown {
    const obj: any = {};
    message.contract !== undefined && (obj.contract = message.contract);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<BridgeNetworkParams>, I>>(object: I): BridgeNetworkParams {
    const message = createBaseBridgeNetworkParams();
    message.contract = object.contract ?? "";
    return message;
  },
};

function createBaseFeeNetworkParams(): FeeNetworkParams {
  return { contract: "", feeTokens: [] };
}

export const FeeNetworkParams = {
  encode(message: FeeNetworkParams, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.contract !== "") {
      writer.uint32(10).string(message.contract);
    }
    for (const v of message.feeTokens) {
      FeeToken.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): FeeNetworkParams {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFeeNetworkParams();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.contract = reader.string();
          break;
        case 2:
          message.feeTokens.push(FeeToken.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): FeeNetworkParams {
    return {
      contract: isSet(object.contract) ? String(object.contract) : "",
      feeTokens: Array.isArray(object?.feeTokens) ? object.feeTokens.map((e: any) => FeeToken.fromJSON(e)) : [],
    };
  },

  toJSON(message: FeeNetworkParams): unknown {
    const obj: any = {};
    message.contract !== undefined && (obj.contract = message.contract);
    if (message.feeTokens) {
      obj.feeTokens = message.feeTokens.map((e) => e ? FeeToken.toJSON(e) : undefined);
    } else {
      obj.feeTokens = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<FeeNetworkParams>, I>>(object: I): FeeNetworkParams {
    const message = createBaseFeeNetworkParams();
    message.contract = object.contract ?? "";
    message.feeTokens = object.feeTokens?.map((e) => FeeToken.fromPartial(e)) || [];
    return message;
  },
};

function createBaseIdentityNetworkParams(): IdentityNetworkParams {
  return { contract: "" };
}

export const IdentityNetworkParams = {
  encode(message: IdentityNetworkParams, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.contract !== "") {
      writer.uint32(10).string(message.contract);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): IdentityNetworkParams {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseIdentityNetworkParams();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.contract = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): IdentityNetworkParams {
    return { contract: isSet(object.contract) ? String(object.contract) : "" };
  },

  toJSON(message: IdentityNetworkParams): unknown {
    const obj: any = {};
    message.contract !== undefined && (obj.contract = message.contract);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<IdentityNetworkParams>, I>>(object: I): IdentityNetworkParams {
    const message = createBaseIdentityNetworkParams();
    message.contract = object.contract ?? "";
    return message;
  },
};

function createBaseFeeToken(): FeeToken {
  return { contract: "", amount: "" };
}

export const FeeToken = {
  encode(message: FeeToken, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.contract !== "") {
      writer.uint32(10).string(message.contract);
    }
    if (message.amount !== "") {
      writer.uint32(18).string(message.amount);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): FeeToken {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFeeToken();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.contract = reader.string();
          break;
        case 2:
          message.amount = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): FeeToken {
    return {
      contract: isSet(object.contract) ? String(object.contract) : "",
      amount: isSet(object.amount) ? String(object.amount) : "",
    };
  },

  toJSON(message: FeeToken): unknown {
    const obj: any = {};
    message.contract !== undefined && (obj.contract = message.contract);
    message.amount !== undefined && (obj.amount = message.amount);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<FeeToken>, I>>(object: I): FeeToken {
    const message = createBaseFeeToken();
    message.contract = object.contract ?? "";
    message.amount = object.amount ?? "";
    return message;
  },
};

function createBaseParams(): Params {
  return { networks: [] };
}

export const Params = {
  encode(message: Params, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.networks) {
      Network.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Params {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseParams();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.networks.push(Network.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Params {
    return { networks: Array.isArray(object?.networks) ? object.networks.map((e: any) => Network.fromJSON(e)) : [] };
  },

  toJSON(message: Params): unknown {
    const obj: any = {};
    if (message.networks) {
      obj.networks = message.networks.map((e) => e ? Network.toJSON(e) : undefined);
    } else {
      obj.networks = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Params>, I>>(object: I): Params {
    const message = createBaseParams();
    message.networks = object.networks?.map((e) => Network.fromPartial(e)) || [];
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

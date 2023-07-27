/* eslint-disable */
import _m0 from "protobufjs/minimal";
import { Type, typeFromJSON, typeToJSON } from "./item";

export const protobufPackage = "rarimo.rarimocore.tokenmanager";

export interface CollectionMetadata {
  name: string;
  symbol: string;
  metadataURI: string;
}

export interface CollectionDataIndex {
  /** Chain name */
  chain: string;
  /** Collection contract address */
  address: string;
}

export interface CollectionData {
  index: CollectionDataIndex | undefined;
  collection: string;
  tokenType: Type;
  wrapped: boolean;
  decimals: number;
}

export interface Collection {
  index: string;
  meta: CollectionMetadata | undefined;
  data: CollectionDataIndex[];
}

function createBaseCollectionMetadata(): CollectionMetadata {
  return { name: "", symbol: "", metadataURI: "" };
}

export const CollectionMetadata = {
  encode(message: CollectionMetadata, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.name !== "") {
      writer.uint32(10).string(message.name);
    }
    if (message.symbol !== "") {
      writer.uint32(18).string(message.symbol);
    }
    if (message.metadataURI !== "") {
      writer.uint32(26).string(message.metadataURI);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CollectionMetadata {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCollectionMetadata();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.name = reader.string();
          break;
        case 2:
          message.symbol = reader.string();
          break;
        case 3:
          message.metadataURI = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CollectionMetadata {
    return {
      name: isSet(object.name) ? String(object.name) : "",
      symbol: isSet(object.symbol) ? String(object.symbol) : "",
      metadataURI: isSet(object.metadataURI) ? String(object.metadataURI) : "",
    };
  },

  toJSON(message: CollectionMetadata): unknown {
    const obj: any = {};
    message.name !== undefined && (obj.name = message.name);
    message.symbol !== undefined && (obj.symbol = message.symbol);
    message.metadataURI !== undefined && (obj.metadataURI = message.metadataURI);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<CollectionMetadata>, I>>(object: I): CollectionMetadata {
    const message = createBaseCollectionMetadata();
    message.name = object.name ?? "";
    message.symbol = object.symbol ?? "";
    message.metadataURI = object.metadataURI ?? "";
    return message;
  },
};

function createBaseCollectionDataIndex(): CollectionDataIndex {
  return { chain: "", address: "" };
}

export const CollectionDataIndex = {
  encode(message: CollectionDataIndex, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.chain !== "") {
      writer.uint32(10).string(message.chain);
    }
    if (message.address !== "") {
      writer.uint32(18).string(message.address);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CollectionDataIndex {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCollectionDataIndex();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.chain = reader.string();
          break;
        case 2:
          message.address = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CollectionDataIndex {
    return {
      chain: isSet(object.chain) ? String(object.chain) : "",
      address: isSet(object.address) ? String(object.address) : "",
    };
  },

  toJSON(message: CollectionDataIndex): unknown {
    const obj: any = {};
    message.chain !== undefined && (obj.chain = message.chain);
    message.address !== undefined && (obj.address = message.address);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<CollectionDataIndex>, I>>(object: I): CollectionDataIndex {
    const message = createBaseCollectionDataIndex();
    message.chain = object.chain ?? "";
    message.address = object.address ?? "";
    return message;
  },
};

function createBaseCollectionData(): CollectionData {
  return { index: undefined, collection: "", tokenType: 0, wrapped: false, decimals: 0 };
}

export const CollectionData = {
  encode(message: CollectionData, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.index !== undefined) {
      CollectionDataIndex.encode(message.index, writer.uint32(10).fork()).ldelim();
    }
    if (message.collection !== "") {
      writer.uint32(18).string(message.collection);
    }
    if (message.tokenType !== 0) {
      writer.uint32(24).int32(message.tokenType);
    }
    if (message.wrapped === true) {
      writer.uint32(32).bool(message.wrapped);
    }
    if (message.decimals !== 0) {
      writer.uint32(40).uint32(message.decimals);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CollectionData {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCollectionData();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.index = CollectionDataIndex.decode(reader, reader.uint32());
          break;
        case 2:
          message.collection = reader.string();
          break;
        case 3:
          message.tokenType = reader.int32() as any;
          break;
        case 4:
          message.wrapped = reader.bool();
          break;
        case 5:
          message.decimals = reader.uint32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CollectionData {
    return {
      index: isSet(object.index) ? CollectionDataIndex.fromJSON(object.index) : undefined,
      collection: isSet(object.collection) ? String(object.collection) : "",
      tokenType: isSet(object.tokenType) ? typeFromJSON(object.tokenType) : 0,
      wrapped: isSet(object.wrapped) ? Boolean(object.wrapped) : false,
      decimals: isSet(object.decimals) ? Number(object.decimals) : 0,
    };
  },

  toJSON(message: CollectionData): unknown {
    const obj: any = {};
    message.index !== undefined && (obj.index = message.index ? CollectionDataIndex.toJSON(message.index) : undefined);
    message.collection !== undefined && (obj.collection = message.collection);
    message.tokenType !== undefined && (obj.tokenType = typeToJSON(message.tokenType));
    message.wrapped !== undefined && (obj.wrapped = message.wrapped);
    message.decimals !== undefined && (obj.decimals = Math.round(message.decimals));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<CollectionData>, I>>(object: I): CollectionData {
    const message = createBaseCollectionData();
    message.index = (object.index !== undefined && object.index !== null)
      ? CollectionDataIndex.fromPartial(object.index)
      : undefined;
    message.collection = object.collection ?? "";
    message.tokenType = object.tokenType ?? 0;
    message.wrapped = object.wrapped ?? false;
    message.decimals = object.decimals ?? 0;
    return message;
  },
};

function createBaseCollection(): Collection {
  return { index: "", meta: undefined, data: [] };
}

export const Collection = {
  encode(message: Collection, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.index !== "") {
      writer.uint32(10).string(message.index);
    }
    if (message.meta !== undefined) {
      CollectionMetadata.encode(message.meta, writer.uint32(18).fork()).ldelim();
    }
    for (const v of message.data) {
      CollectionDataIndex.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Collection {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCollection();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.index = reader.string();
          break;
        case 2:
          message.meta = CollectionMetadata.decode(reader, reader.uint32());
          break;
        case 3:
          message.data.push(CollectionDataIndex.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Collection {
    return {
      index: isSet(object.index) ? String(object.index) : "",
      meta: isSet(object.meta) ? CollectionMetadata.fromJSON(object.meta) : undefined,
      data: Array.isArray(object?.data) ? object.data.map((e: any) => CollectionDataIndex.fromJSON(e)) : [],
    };
  },

  toJSON(message: Collection): unknown {
    const obj: any = {};
    message.index !== undefined && (obj.index = message.index);
    message.meta !== undefined && (obj.meta = message.meta ? CollectionMetadata.toJSON(message.meta) : undefined);
    if (message.data) {
      obj.data = message.data.map((e) => e ? CollectionDataIndex.toJSON(e) : undefined);
    } else {
      obj.data = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Collection>, I>>(object: I): Collection {
    const message = createBaseCollection();
    message.index = object.index ?? "";
    message.meta = (object.meta !== undefined && object.meta !== null)
      ? CollectionMetadata.fromPartial(object.meta)
      : undefined;
    message.data = object.data?.map((e) => CollectionDataIndex.fromPartial(e)) || [];
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

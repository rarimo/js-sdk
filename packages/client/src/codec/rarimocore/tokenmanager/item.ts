/* eslint-disable */
import _m0 from "protobufjs/minimal";

export const protobufPackage = "rarimo.rarimocore.tokenmanager";

export enum Type {
  NATIVE = 0,
  ERC20 = 1,
  ERC721 = 2,
  ERC1155 = 3,
  METAPLEX_NFT = 4,
  METAPLEX_FT = 5,
  NEAR_FT = 6,
  NEAR_NFT = 7,
  UNRECOGNIZED = -1,
}

export function typeFromJSON(object: any): Type {
  switch (object) {
    case 0:
    case "NATIVE":
      return Type.NATIVE;
    case 1:
    case "ERC20":
      return Type.ERC20;
    case 2:
    case "ERC721":
      return Type.ERC721;
    case 3:
    case "ERC1155":
      return Type.ERC1155;
    case 4:
    case "METAPLEX_NFT":
      return Type.METAPLEX_NFT;
    case 5:
    case "METAPLEX_FT":
      return Type.METAPLEX_FT;
    case 6:
    case "NEAR_FT":
      return Type.NEAR_FT;
    case 7:
    case "NEAR_NFT":
      return Type.NEAR_NFT;
    case -1:
    case "UNRECOGNIZED":
    default:
      return Type.UNRECOGNIZED;
  }
}

export function typeToJSON(object: Type): string {
  switch (object) {
    case Type.NATIVE:
      return "NATIVE";
    case Type.ERC20:
      return "ERC20";
    case Type.ERC721:
      return "ERC721";
    case Type.ERC1155:
      return "ERC1155";
    case Type.METAPLEX_NFT:
      return "METAPLEX_NFT";
    case Type.METAPLEX_FT:
      return "METAPLEX_FT";
    case Type.NEAR_FT:
      return "NEAR_FT";
    case Type.NEAR_NFT:
      return "NEAR_NFT";
    case Type.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface ItemMetadata {
  imageUri: string;
  /** Hash of the token image. Encoded into hex string. (optional) */
  imageHash: string;
  /** Seed is used to generate PDA address for Solana */
  seed: string;
  uri: string;
}

export interface Seed {
  /** index */
  seed: string;
  item: string;
}

export interface Item {
  index: string;
  collection: string;
  meta: ItemMetadata | undefined;
  onChain: OnChainItemIndex[];
}

export interface OnChainItemIndex {
  chain: string;
  address: string;
  tokenID: string;
}

export interface OnChainItem {
  index: OnChainItemIndex | undefined;
  item: string;
}

function createBaseItemMetadata(): ItemMetadata {
  return { imageUri: "", imageHash: "", seed: "", uri: "" };
}

export const ItemMetadata = {
  encode(message: ItemMetadata, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.imageUri !== "") {
      writer.uint32(10).string(message.imageUri);
    }
    if (message.imageHash !== "") {
      writer.uint32(18).string(message.imageHash);
    }
    if (message.seed !== "") {
      writer.uint32(26).string(message.seed);
    }
    if (message.uri !== "") {
      writer.uint32(34).string(message.uri);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ItemMetadata {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseItemMetadata();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.imageUri = reader.string();
          break;
        case 2:
          message.imageHash = reader.string();
          break;
        case 3:
          message.seed = reader.string();
          break;
        case 4:
          message.uri = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ItemMetadata {
    return {
      imageUri: isSet(object.imageUri) ? String(object.imageUri) : "",
      imageHash: isSet(object.imageHash) ? String(object.imageHash) : "",
      seed: isSet(object.seed) ? String(object.seed) : "",
      uri: isSet(object.uri) ? String(object.uri) : "",
    };
  },

  toJSON(message: ItemMetadata): unknown {
    const obj: any = {};
    message.imageUri !== undefined && (obj.imageUri = message.imageUri);
    message.imageHash !== undefined && (obj.imageHash = message.imageHash);
    message.seed !== undefined && (obj.seed = message.seed);
    message.uri !== undefined && (obj.uri = message.uri);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ItemMetadata>, I>>(object: I): ItemMetadata {
    const message = createBaseItemMetadata();
    message.imageUri = object.imageUri ?? "";
    message.imageHash = object.imageHash ?? "";
    message.seed = object.seed ?? "";
    message.uri = object.uri ?? "";
    return message;
  },
};

function createBaseSeed(): Seed {
  return { seed: "", item: "" };
}

export const Seed = {
  encode(message: Seed, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.seed !== "") {
      writer.uint32(10).string(message.seed);
    }
    if (message.item !== "") {
      writer.uint32(18).string(message.item);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Seed {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSeed();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.seed = reader.string();
          break;
        case 2:
          message.item = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Seed {
    return { seed: isSet(object.seed) ? String(object.seed) : "", item: isSet(object.item) ? String(object.item) : "" };
  },

  toJSON(message: Seed): unknown {
    const obj: any = {};
    message.seed !== undefined && (obj.seed = message.seed);
    message.item !== undefined && (obj.item = message.item);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Seed>, I>>(object: I): Seed {
    const message = createBaseSeed();
    message.seed = object.seed ?? "";
    message.item = object.item ?? "";
    return message;
  },
};

function createBaseItem(): Item {
  return { index: "", collection: "", meta: undefined, onChain: [] };
}

export const Item = {
  encode(message: Item, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.index !== "") {
      writer.uint32(10).string(message.index);
    }
    if (message.collection !== "") {
      writer.uint32(18).string(message.collection);
    }
    if (message.meta !== undefined) {
      ItemMetadata.encode(message.meta, writer.uint32(26).fork()).ldelim();
    }
    for (const v of message.onChain) {
      OnChainItemIndex.encode(v!, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Item {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseItem();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.index = reader.string();
          break;
        case 2:
          message.collection = reader.string();
          break;
        case 3:
          message.meta = ItemMetadata.decode(reader, reader.uint32());
          break;
        case 4:
          message.onChain.push(OnChainItemIndex.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Item {
    return {
      index: isSet(object.index) ? String(object.index) : "",
      collection: isSet(object.collection) ? String(object.collection) : "",
      meta: isSet(object.meta) ? ItemMetadata.fromJSON(object.meta) : undefined,
      onChain: Array.isArray(object?.onChain) ? object.onChain.map((e: any) => OnChainItemIndex.fromJSON(e)) : [],
    };
  },

  toJSON(message: Item): unknown {
    const obj: any = {};
    message.index !== undefined && (obj.index = message.index);
    message.collection !== undefined && (obj.collection = message.collection);
    message.meta !== undefined && (obj.meta = message.meta ? ItemMetadata.toJSON(message.meta) : undefined);
    if (message.onChain) {
      obj.onChain = message.onChain.map((e) => e ? OnChainItemIndex.toJSON(e) : undefined);
    } else {
      obj.onChain = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Item>, I>>(object: I): Item {
    const message = createBaseItem();
    message.index = object.index ?? "";
    message.collection = object.collection ?? "";
    message.meta = (object.meta !== undefined && object.meta !== null)
      ? ItemMetadata.fromPartial(object.meta)
      : undefined;
    message.onChain = object.onChain?.map((e) => OnChainItemIndex.fromPartial(e)) || [];
    return message;
  },
};

function createBaseOnChainItemIndex(): OnChainItemIndex {
  return { chain: "", address: "", tokenID: "" };
}

export const OnChainItemIndex = {
  encode(message: OnChainItemIndex, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.chain !== "") {
      writer.uint32(10).string(message.chain);
    }
    if (message.address !== "") {
      writer.uint32(18).string(message.address);
    }
    if (message.tokenID !== "") {
      writer.uint32(26).string(message.tokenID);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): OnChainItemIndex {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseOnChainItemIndex();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.chain = reader.string();
          break;
        case 2:
          message.address = reader.string();
          break;
        case 3:
          message.tokenID = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): OnChainItemIndex {
    return {
      chain: isSet(object.chain) ? String(object.chain) : "",
      address: isSet(object.address) ? String(object.address) : "",
      tokenID: isSet(object.tokenID) ? String(object.tokenID) : "",
    };
  },

  toJSON(message: OnChainItemIndex): unknown {
    const obj: any = {};
    message.chain !== undefined && (obj.chain = message.chain);
    message.address !== undefined && (obj.address = message.address);
    message.tokenID !== undefined && (obj.tokenID = message.tokenID);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<OnChainItemIndex>, I>>(object: I): OnChainItemIndex {
    const message = createBaseOnChainItemIndex();
    message.chain = object.chain ?? "";
    message.address = object.address ?? "";
    message.tokenID = object.tokenID ?? "";
    return message;
  },
};

function createBaseOnChainItem(): OnChainItem {
  return { index: undefined, item: "" };
}

export const OnChainItem = {
  encode(message: OnChainItem, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.index !== undefined) {
      OnChainItemIndex.encode(message.index, writer.uint32(10).fork()).ldelim();
    }
    if (message.item !== "") {
      writer.uint32(18).string(message.item);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): OnChainItem {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseOnChainItem();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.index = OnChainItemIndex.decode(reader, reader.uint32());
          break;
        case 2:
          message.item = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): OnChainItem {
    return {
      index: isSet(object.index) ? OnChainItemIndex.fromJSON(object.index) : undefined,
      item: isSet(object.item) ? String(object.item) : "",
    };
  },

  toJSON(message: OnChainItem): unknown {
    const obj: any = {};
    message.index !== undefined && (obj.index = message.index ? OnChainItemIndex.toJSON(message.index) : undefined);
    message.item !== undefined && (obj.item = message.item);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<OnChainItem>, I>>(object: I): OnChainItem {
    const message = createBaseOnChainItem();
    message.index = (object.index !== undefined && object.index !== null)
      ? OnChainItemIndex.fromPartial(object.index)
      : undefined;
    message.item = object.item ?? "";
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

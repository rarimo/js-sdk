/* eslint-disable */
import _m0 from "protobufjs/minimal";
import { CollectionData, CollectionDataIndex, CollectionMetadata } from "./collection";
import { Item, OnChainItem } from "./item";
import { FeeToken, Network } from "./params";

export const protobufPackage = "rarimo.rarimocore.tokenmanager";

export enum UpgradeType {
  NONE = 0,
  BASIC_IMPLEMENTATION = 1,
  OTHER = 2,
  UNRECOGNIZED = -1,
}

export function upgradeTypeFromJSON(object: any): UpgradeType {
  switch (object) {
    case 0:
    case "NONE":
      return UpgradeType.NONE;
    case 1:
    case "BASIC_IMPLEMENTATION":
      return UpgradeType.BASIC_IMPLEMENTATION;
    case 2:
    case "OTHER":
      return UpgradeType.OTHER;
    case -1:
    case "UNRECOGNIZED":
    default:
      return UpgradeType.UNRECOGNIZED;
  }
}

export function upgradeTypeToJSON(object: UpgradeType): string {
  switch (object) {
    case UpgradeType.NONE:
      return "NONE";
    case UpgradeType.BASIC_IMPLEMENTATION:
      return "BASIC_IMPLEMENTATION";
    case UpgradeType.OTHER:
      return "OTHER";
    case UpgradeType.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface ContractUpgradeDetails {
  /** Target contract address upgrade to */
  targetContract: string;
  /** New contract address: used on EVM */
  newImplementationContract: string;
  /** byte code hash: used on Solana and Near */
  hash: string;
  /** Solana buffer account */
  bufferAccount: string;
  /** chain name according to stored in tokenmanager params */
  chain: string;
  /** dec nonce */
  nonce: string;
  type: UpgradeType;
}

export interface UpgradeContractProposal {
  title: string;
  description: string;
  details: ContractUpgradeDetails | undefined;
}

export interface AddNetworkProposal {
  title: string;
  description: string;
  network: Network | undefined;
}

export interface RemoveNetworkProposal {
  title: string;
  description: string;
  chain: string;
}

export interface AddFeeTokenProposal {
  title: string;
  description: string;
  chain: string;
  nonce: string;
  token: FeeToken | undefined;
}

export interface UpdateFeeTokenProposal {
  title: string;
  description: string;
  chain: string;
  nonce: string;
  token: FeeToken | undefined;
}

export interface RemoveFeeTokenProposal {
  title: string;
  description: string;
  chain: string;
  contract: string;
  nonce: string;
}

export interface WithdrawFeeProposal {
  title: string;
  description: string;
  chain: string;
  token: FeeToken | undefined;
  receiver: string;
  nonce: string;
}

export interface UpdateTokenItemProposal {
  title: string;
  description: string;
  item: Item[];
}

export interface RemoveTokenItemProposal {
  title: string;
  description: string;
  index: string[];
}

export interface CreateCollectionProposal {
  title: string;
  description: string;
  index: string;
  metadata:
    | CollectionMetadata
    | undefined;
  /** All supported networks described */
  data: CollectionData[];
  item: Item[];
  onChainItem: OnChainItem[];
}

export interface UpdateCollectionDataProposal {
  title: string;
  description: string;
  data: CollectionData[];
}

export interface AddCollectionDataProposal {
  title: string;
  description: string;
  data: CollectionData[];
}

export interface RemoveCollectionDataProposal {
  title: string;
  description: string;
  index: CollectionDataIndex[];
}

export interface RemoveCollectionProposal {
  title: string;
  description: string;
  index: string;
}

function createBaseContractUpgradeDetails(): ContractUpgradeDetails {
  return {
    targetContract: "",
    newImplementationContract: "",
    hash: "",
    bufferAccount: "",
    chain: "",
    nonce: "",
    type: 0,
  };
}

export const ContractUpgradeDetails = {
  encode(message: ContractUpgradeDetails, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.targetContract !== "") {
      writer.uint32(10).string(message.targetContract);
    }
    if (message.newImplementationContract !== "") {
      writer.uint32(18).string(message.newImplementationContract);
    }
    if (message.hash !== "") {
      writer.uint32(26).string(message.hash);
    }
    if (message.bufferAccount !== "") {
      writer.uint32(34).string(message.bufferAccount);
    }
    if (message.chain !== "") {
      writer.uint32(42).string(message.chain);
    }
    if (message.nonce !== "") {
      writer.uint32(50).string(message.nonce);
    }
    if (message.type !== 0) {
      writer.uint32(56).int32(message.type);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ContractUpgradeDetails {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseContractUpgradeDetails();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.targetContract = reader.string();
          break;
        case 2:
          message.newImplementationContract = reader.string();
          break;
        case 3:
          message.hash = reader.string();
          break;
        case 4:
          message.bufferAccount = reader.string();
          break;
        case 5:
          message.chain = reader.string();
          break;
        case 6:
          message.nonce = reader.string();
          break;
        case 7:
          message.type = reader.int32() as any;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ContractUpgradeDetails {
    return {
      targetContract: isSet(object.targetContract) ? String(object.targetContract) : "",
      newImplementationContract: isSet(object.newImplementationContract)
        ? String(object.newImplementationContract)
        : "",
      hash: isSet(object.hash) ? String(object.hash) : "",
      bufferAccount: isSet(object.bufferAccount) ? String(object.bufferAccount) : "",
      chain: isSet(object.chain) ? String(object.chain) : "",
      nonce: isSet(object.nonce) ? String(object.nonce) : "",
      type: isSet(object.type) ? upgradeTypeFromJSON(object.type) : 0,
    };
  },

  toJSON(message: ContractUpgradeDetails): unknown {
    const obj: any = {};
    message.targetContract !== undefined && (obj.targetContract = message.targetContract);
    message.newImplementationContract !== undefined
      && (obj.newImplementationContract = message.newImplementationContract);
    message.hash !== undefined && (obj.hash = message.hash);
    message.bufferAccount !== undefined && (obj.bufferAccount = message.bufferAccount);
    message.chain !== undefined && (obj.chain = message.chain);
    message.nonce !== undefined && (obj.nonce = message.nonce);
    message.type !== undefined && (obj.type = upgradeTypeToJSON(message.type));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ContractUpgradeDetails>, I>>(object: I): ContractUpgradeDetails {
    const message = createBaseContractUpgradeDetails();
    message.targetContract = object.targetContract ?? "";
    message.newImplementationContract = object.newImplementationContract ?? "";
    message.hash = object.hash ?? "";
    message.bufferAccount = object.bufferAccount ?? "";
    message.chain = object.chain ?? "";
    message.nonce = object.nonce ?? "";
    message.type = object.type ?? 0;
    return message;
  },
};

function createBaseUpgradeContractProposal(): UpgradeContractProposal {
  return { title: "", description: "", details: undefined };
}

export const UpgradeContractProposal = {
  encode(message: UpgradeContractProposal, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.title !== "") {
      writer.uint32(10).string(message.title);
    }
    if (message.description !== "") {
      writer.uint32(18).string(message.description);
    }
    if (message.details !== undefined) {
      ContractUpgradeDetails.encode(message.details, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UpgradeContractProposal {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpgradeContractProposal();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.title = reader.string();
          break;
        case 2:
          message.description = reader.string();
          break;
        case 4:
          message.details = ContractUpgradeDetails.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UpgradeContractProposal {
    return {
      title: isSet(object.title) ? String(object.title) : "",
      description: isSet(object.description) ? String(object.description) : "",
      details: isSet(object.details) ? ContractUpgradeDetails.fromJSON(object.details) : undefined,
    };
  },

  toJSON(message: UpgradeContractProposal): unknown {
    const obj: any = {};
    message.title !== undefined && (obj.title = message.title);
    message.description !== undefined && (obj.description = message.description);
    message.details !== undefined
      && (obj.details = message.details ? ContractUpgradeDetails.toJSON(message.details) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<UpgradeContractProposal>, I>>(object: I): UpgradeContractProposal {
    const message = createBaseUpgradeContractProposal();
    message.title = object.title ?? "";
    message.description = object.description ?? "";
    message.details = (object.details !== undefined && object.details !== null)
      ? ContractUpgradeDetails.fromPartial(object.details)
      : undefined;
    return message;
  },
};

function createBaseAddNetworkProposal(): AddNetworkProposal {
  return { title: "", description: "", network: undefined };
}

export const AddNetworkProposal = {
  encode(message: AddNetworkProposal, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.title !== "") {
      writer.uint32(10).string(message.title);
    }
    if (message.description !== "") {
      writer.uint32(18).string(message.description);
    }
    if (message.network !== undefined) {
      Network.encode(message.network, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AddNetworkProposal {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAddNetworkProposal();
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
          message.network = Network.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): AddNetworkProposal {
    return {
      title: isSet(object.title) ? String(object.title) : "",
      description: isSet(object.description) ? String(object.description) : "",
      network: isSet(object.network) ? Network.fromJSON(object.network) : undefined,
    };
  },

  toJSON(message: AddNetworkProposal): unknown {
    const obj: any = {};
    message.title !== undefined && (obj.title = message.title);
    message.description !== undefined && (obj.description = message.description);
    message.network !== undefined && (obj.network = message.network ? Network.toJSON(message.network) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<AddNetworkProposal>, I>>(object: I): AddNetworkProposal {
    const message = createBaseAddNetworkProposal();
    message.title = object.title ?? "";
    message.description = object.description ?? "";
    message.network = (object.network !== undefined && object.network !== null)
      ? Network.fromPartial(object.network)
      : undefined;
    return message;
  },
};

function createBaseRemoveNetworkProposal(): RemoveNetworkProposal {
  return { title: "", description: "", chain: "" };
}

export const RemoveNetworkProposal = {
  encode(message: RemoveNetworkProposal, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.title !== "") {
      writer.uint32(10).string(message.title);
    }
    if (message.description !== "") {
      writer.uint32(18).string(message.description);
    }
    if (message.chain !== "") {
      writer.uint32(26).string(message.chain);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RemoveNetworkProposal {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRemoveNetworkProposal();
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
          message.chain = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): RemoveNetworkProposal {
    return {
      title: isSet(object.title) ? String(object.title) : "",
      description: isSet(object.description) ? String(object.description) : "",
      chain: isSet(object.chain) ? String(object.chain) : "",
    };
  },

  toJSON(message: RemoveNetworkProposal): unknown {
    const obj: any = {};
    message.title !== undefined && (obj.title = message.title);
    message.description !== undefined && (obj.description = message.description);
    message.chain !== undefined && (obj.chain = message.chain);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<RemoveNetworkProposal>, I>>(object: I): RemoveNetworkProposal {
    const message = createBaseRemoveNetworkProposal();
    message.title = object.title ?? "";
    message.description = object.description ?? "";
    message.chain = object.chain ?? "";
    return message;
  },
};

function createBaseAddFeeTokenProposal(): AddFeeTokenProposal {
  return { title: "", description: "", chain: "", nonce: "", token: undefined };
}

export const AddFeeTokenProposal = {
  encode(message: AddFeeTokenProposal, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.title !== "") {
      writer.uint32(10).string(message.title);
    }
    if (message.description !== "") {
      writer.uint32(18).string(message.description);
    }
    if (message.chain !== "") {
      writer.uint32(26).string(message.chain);
    }
    if (message.nonce !== "") {
      writer.uint32(34).string(message.nonce);
    }
    if (message.token !== undefined) {
      FeeToken.encode(message.token, writer.uint32(42).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AddFeeTokenProposal {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAddFeeTokenProposal();
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
          message.chain = reader.string();
          break;
        case 4:
          message.nonce = reader.string();
          break;
        case 5:
          message.token = FeeToken.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): AddFeeTokenProposal {
    return {
      title: isSet(object.title) ? String(object.title) : "",
      description: isSet(object.description) ? String(object.description) : "",
      chain: isSet(object.chain) ? String(object.chain) : "",
      nonce: isSet(object.nonce) ? String(object.nonce) : "",
      token: isSet(object.token) ? FeeToken.fromJSON(object.token) : undefined,
    };
  },

  toJSON(message: AddFeeTokenProposal): unknown {
    const obj: any = {};
    message.title !== undefined && (obj.title = message.title);
    message.description !== undefined && (obj.description = message.description);
    message.chain !== undefined && (obj.chain = message.chain);
    message.nonce !== undefined && (obj.nonce = message.nonce);
    message.token !== undefined && (obj.token = message.token ? FeeToken.toJSON(message.token) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<AddFeeTokenProposal>, I>>(object: I): AddFeeTokenProposal {
    const message = createBaseAddFeeTokenProposal();
    message.title = object.title ?? "";
    message.description = object.description ?? "";
    message.chain = object.chain ?? "";
    message.nonce = object.nonce ?? "";
    message.token = (object.token !== undefined && object.token !== null)
      ? FeeToken.fromPartial(object.token)
      : undefined;
    return message;
  },
};

function createBaseUpdateFeeTokenProposal(): UpdateFeeTokenProposal {
  return { title: "", description: "", chain: "", nonce: "", token: undefined };
}

export const UpdateFeeTokenProposal = {
  encode(message: UpdateFeeTokenProposal, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.title !== "") {
      writer.uint32(10).string(message.title);
    }
    if (message.description !== "") {
      writer.uint32(18).string(message.description);
    }
    if (message.chain !== "") {
      writer.uint32(26).string(message.chain);
    }
    if (message.nonce !== "") {
      writer.uint32(34).string(message.nonce);
    }
    if (message.token !== undefined) {
      FeeToken.encode(message.token, writer.uint32(42).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UpdateFeeTokenProposal {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpdateFeeTokenProposal();
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
          message.chain = reader.string();
          break;
        case 4:
          message.nonce = reader.string();
          break;
        case 5:
          message.token = FeeToken.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UpdateFeeTokenProposal {
    return {
      title: isSet(object.title) ? String(object.title) : "",
      description: isSet(object.description) ? String(object.description) : "",
      chain: isSet(object.chain) ? String(object.chain) : "",
      nonce: isSet(object.nonce) ? String(object.nonce) : "",
      token: isSet(object.token) ? FeeToken.fromJSON(object.token) : undefined,
    };
  },

  toJSON(message: UpdateFeeTokenProposal): unknown {
    const obj: any = {};
    message.title !== undefined && (obj.title = message.title);
    message.description !== undefined && (obj.description = message.description);
    message.chain !== undefined && (obj.chain = message.chain);
    message.nonce !== undefined && (obj.nonce = message.nonce);
    message.token !== undefined && (obj.token = message.token ? FeeToken.toJSON(message.token) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<UpdateFeeTokenProposal>, I>>(object: I): UpdateFeeTokenProposal {
    const message = createBaseUpdateFeeTokenProposal();
    message.title = object.title ?? "";
    message.description = object.description ?? "";
    message.chain = object.chain ?? "";
    message.nonce = object.nonce ?? "";
    message.token = (object.token !== undefined && object.token !== null)
      ? FeeToken.fromPartial(object.token)
      : undefined;
    return message;
  },
};

function createBaseRemoveFeeTokenProposal(): RemoveFeeTokenProposal {
  return { title: "", description: "", chain: "", contract: "", nonce: "" };
}

export const RemoveFeeTokenProposal = {
  encode(message: RemoveFeeTokenProposal, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.title !== "") {
      writer.uint32(10).string(message.title);
    }
    if (message.description !== "") {
      writer.uint32(18).string(message.description);
    }
    if (message.chain !== "") {
      writer.uint32(26).string(message.chain);
    }
    if (message.contract !== "") {
      writer.uint32(34).string(message.contract);
    }
    if (message.nonce !== "") {
      writer.uint32(42).string(message.nonce);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RemoveFeeTokenProposal {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRemoveFeeTokenProposal();
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
          message.chain = reader.string();
          break;
        case 4:
          message.contract = reader.string();
          break;
        case 5:
          message.nonce = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): RemoveFeeTokenProposal {
    return {
      title: isSet(object.title) ? String(object.title) : "",
      description: isSet(object.description) ? String(object.description) : "",
      chain: isSet(object.chain) ? String(object.chain) : "",
      contract: isSet(object.contract) ? String(object.contract) : "",
      nonce: isSet(object.nonce) ? String(object.nonce) : "",
    };
  },

  toJSON(message: RemoveFeeTokenProposal): unknown {
    const obj: any = {};
    message.title !== undefined && (obj.title = message.title);
    message.description !== undefined && (obj.description = message.description);
    message.chain !== undefined && (obj.chain = message.chain);
    message.contract !== undefined && (obj.contract = message.contract);
    message.nonce !== undefined && (obj.nonce = message.nonce);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<RemoveFeeTokenProposal>, I>>(object: I): RemoveFeeTokenProposal {
    const message = createBaseRemoveFeeTokenProposal();
    message.title = object.title ?? "";
    message.description = object.description ?? "";
    message.chain = object.chain ?? "";
    message.contract = object.contract ?? "";
    message.nonce = object.nonce ?? "";
    return message;
  },
};

function createBaseWithdrawFeeProposal(): WithdrawFeeProposal {
  return { title: "", description: "", chain: "", token: undefined, receiver: "", nonce: "" };
}

export const WithdrawFeeProposal = {
  encode(message: WithdrawFeeProposal, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.title !== "") {
      writer.uint32(10).string(message.title);
    }
    if (message.description !== "") {
      writer.uint32(18).string(message.description);
    }
    if (message.chain !== "") {
      writer.uint32(26).string(message.chain);
    }
    if (message.token !== undefined) {
      FeeToken.encode(message.token, writer.uint32(34).fork()).ldelim();
    }
    if (message.receiver !== "") {
      writer.uint32(42).string(message.receiver);
    }
    if (message.nonce !== "") {
      writer.uint32(50).string(message.nonce);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): WithdrawFeeProposal {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseWithdrawFeeProposal();
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
          message.chain = reader.string();
          break;
        case 4:
          message.token = FeeToken.decode(reader, reader.uint32());
          break;
        case 5:
          message.receiver = reader.string();
          break;
        case 6:
          message.nonce = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): WithdrawFeeProposal {
    return {
      title: isSet(object.title) ? String(object.title) : "",
      description: isSet(object.description) ? String(object.description) : "",
      chain: isSet(object.chain) ? String(object.chain) : "",
      token: isSet(object.token) ? FeeToken.fromJSON(object.token) : undefined,
      receiver: isSet(object.receiver) ? String(object.receiver) : "",
      nonce: isSet(object.nonce) ? String(object.nonce) : "",
    };
  },

  toJSON(message: WithdrawFeeProposal): unknown {
    const obj: any = {};
    message.title !== undefined && (obj.title = message.title);
    message.description !== undefined && (obj.description = message.description);
    message.chain !== undefined && (obj.chain = message.chain);
    message.token !== undefined && (obj.token = message.token ? FeeToken.toJSON(message.token) : undefined);
    message.receiver !== undefined && (obj.receiver = message.receiver);
    message.nonce !== undefined && (obj.nonce = message.nonce);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<WithdrawFeeProposal>, I>>(object: I): WithdrawFeeProposal {
    const message = createBaseWithdrawFeeProposal();
    message.title = object.title ?? "";
    message.description = object.description ?? "";
    message.chain = object.chain ?? "";
    message.token = (object.token !== undefined && object.token !== null)
      ? FeeToken.fromPartial(object.token)
      : undefined;
    message.receiver = object.receiver ?? "";
    message.nonce = object.nonce ?? "";
    return message;
  },
};

function createBaseUpdateTokenItemProposal(): UpdateTokenItemProposal {
  return { title: "", description: "", item: [] };
}

export const UpdateTokenItemProposal = {
  encode(message: UpdateTokenItemProposal, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.title !== "") {
      writer.uint32(10).string(message.title);
    }
    if (message.description !== "") {
      writer.uint32(18).string(message.description);
    }
    for (const v of message.item) {
      Item.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UpdateTokenItemProposal {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpdateTokenItemProposal();
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
          message.item.push(Item.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UpdateTokenItemProposal {
    return {
      title: isSet(object.title) ? String(object.title) : "",
      description: isSet(object.description) ? String(object.description) : "",
      item: Array.isArray(object?.item) ? object.item.map((e: any) => Item.fromJSON(e)) : [],
    };
  },

  toJSON(message: UpdateTokenItemProposal): unknown {
    const obj: any = {};
    message.title !== undefined && (obj.title = message.title);
    message.description !== undefined && (obj.description = message.description);
    if (message.item) {
      obj.item = message.item.map((e) => e ? Item.toJSON(e) : undefined);
    } else {
      obj.item = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<UpdateTokenItemProposal>, I>>(object: I): UpdateTokenItemProposal {
    const message = createBaseUpdateTokenItemProposal();
    message.title = object.title ?? "";
    message.description = object.description ?? "";
    message.item = object.item?.map((e) => Item.fromPartial(e)) || [];
    return message;
  },
};

function createBaseRemoveTokenItemProposal(): RemoveTokenItemProposal {
  return { title: "", description: "", index: [] };
}

export const RemoveTokenItemProposal = {
  encode(message: RemoveTokenItemProposal, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.title !== "") {
      writer.uint32(10).string(message.title);
    }
    if (message.description !== "") {
      writer.uint32(18).string(message.description);
    }
    for (const v of message.index) {
      writer.uint32(26).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RemoveTokenItemProposal {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRemoveTokenItemProposal();
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
          message.index.push(reader.string());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): RemoveTokenItemProposal {
    return {
      title: isSet(object.title) ? String(object.title) : "",
      description: isSet(object.description) ? String(object.description) : "",
      index: Array.isArray(object?.index) ? object.index.map((e: any) => String(e)) : [],
    };
  },

  toJSON(message: RemoveTokenItemProposal): unknown {
    const obj: any = {};
    message.title !== undefined && (obj.title = message.title);
    message.description !== undefined && (obj.description = message.description);
    if (message.index) {
      obj.index = message.index.map((e) => e);
    } else {
      obj.index = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<RemoveTokenItemProposal>, I>>(object: I): RemoveTokenItemProposal {
    const message = createBaseRemoveTokenItemProposal();
    message.title = object.title ?? "";
    message.description = object.description ?? "";
    message.index = object.index?.map((e) => e) || [];
    return message;
  },
};

function createBaseCreateCollectionProposal(): CreateCollectionProposal {
  return { title: "", description: "", index: "", metadata: undefined, data: [], item: [], onChainItem: [] };
}

export const CreateCollectionProposal = {
  encode(message: CreateCollectionProposal, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.title !== "") {
      writer.uint32(10).string(message.title);
    }
    if (message.description !== "") {
      writer.uint32(18).string(message.description);
    }
    if (message.index !== "") {
      writer.uint32(26).string(message.index);
    }
    if (message.metadata !== undefined) {
      CollectionMetadata.encode(message.metadata, writer.uint32(34).fork()).ldelim();
    }
    for (const v of message.data) {
      CollectionData.encode(v!, writer.uint32(42).fork()).ldelim();
    }
    for (const v of message.item) {
      Item.encode(v!, writer.uint32(50).fork()).ldelim();
    }
    for (const v of message.onChainItem) {
      OnChainItem.encode(v!, writer.uint32(58).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CreateCollectionProposal {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateCollectionProposal();
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
          message.index = reader.string();
          break;
        case 4:
          message.metadata = CollectionMetadata.decode(reader, reader.uint32());
          break;
        case 5:
          message.data.push(CollectionData.decode(reader, reader.uint32()));
          break;
        case 6:
          message.item.push(Item.decode(reader, reader.uint32()));
          break;
        case 7:
          message.onChainItem.push(OnChainItem.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CreateCollectionProposal {
    return {
      title: isSet(object.title) ? String(object.title) : "",
      description: isSet(object.description) ? String(object.description) : "",
      index: isSet(object.index) ? String(object.index) : "",
      metadata: isSet(object.metadata) ? CollectionMetadata.fromJSON(object.metadata) : undefined,
      data: Array.isArray(object?.data) ? object.data.map((e: any) => CollectionData.fromJSON(e)) : [],
      item: Array.isArray(object?.item) ? object.item.map((e: any) => Item.fromJSON(e)) : [],
      onChainItem: Array.isArray(object?.onChainItem)
        ? object.onChainItem.map((e: any) => OnChainItem.fromJSON(e))
        : [],
    };
  },

  toJSON(message: CreateCollectionProposal): unknown {
    const obj: any = {};
    message.title !== undefined && (obj.title = message.title);
    message.description !== undefined && (obj.description = message.description);
    message.index !== undefined && (obj.index = message.index);
    message.metadata !== undefined
      && (obj.metadata = message.metadata ? CollectionMetadata.toJSON(message.metadata) : undefined);
    if (message.data) {
      obj.data = message.data.map((e) => e ? CollectionData.toJSON(e) : undefined);
    } else {
      obj.data = [];
    }
    if (message.item) {
      obj.item = message.item.map((e) => e ? Item.toJSON(e) : undefined);
    } else {
      obj.item = [];
    }
    if (message.onChainItem) {
      obj.onChainItem = message.onChainItem.map((e) => e ? OnChainItem.toJSON(e) : undefined);
    } else {
      obj.onChainItem = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<CreateCollectionProposal>, I>>(object: I): CreateCollectionProposal {
    const message = createBaseCreateCollectionProposal();
    message.title = object.title ?? "";
    message.description = object.description ?? "";
    message.index = object.index ?? "";
    message.metadata = (object.metadata !== undefined && object.metadata !== null)
      ? CollectionMetadata.fromPartial(object.metadata)
      : undefined;
    message.data = object.data?.map((e) => CollectionData.fromPartial(e)) || [];
    message.item = object.item?.map((e) => Item.fromPartial(e)) || [];
    message.onChainItem = object.onChainItem?.map((e) => OnChainItem.fromPartial(e)) || [];
    return message;
  },
};

function createBaseUpdateCollectionDataProposal(): UpdateCollectionDataProposal {
  return { title: "", description: "", data: [] };
}

export const UpdateCollectionDataProposal = {
  encode(message: UpdateCollectionDataProposal, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.title !== "") {
      writer.uint32(10).string(message.title);
    }
    if (message.description !== "") {
      writer.uint32(18).string(message.description);
    }
    for (const v of message.data) {
      CollectionData.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UpdateCollectionDataProposal {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpdateCollectionDataProposal();
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
          message.data.push(CollectionData.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UpdateCollectionDataProposal {
    return {
      title: isSet(object.title) ? String(object.title) : "",
      description: isSet(object.description) ? String(object.description) : "",
      data: Array.isArray(object?.data) ? object.data.map((e: any) => CollectionData.fromJSON(e)) : [],
    };
  },

  toJSON(message: UpdateCollectionDataProposal): unknown {
    const obj: any = {};
    message.title !== undefined && (obj.title = message.title);
    message.description !== undefined && (obj.description = message.description);
    if (message.data) {
      obj.data = message.data.map((e) => e ? CollectionData.toJSON(e) : undefined);
    } else {
      obj.data = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<UpdateCollectionDataProposal>, I>>(object: I): UpdateCollectionDataProposal {
    const message = createBaseUpdateCollectionDataProposal();
    message.title = object.title ?? "";
    message.description = object.description ?? "";
    message.data = object.data?.map((e) => CollectionData.fromPartial(e)) || [];
    return message;
  },
};

function createBaseAddCollectionDataProposal(): AddCollectionDataProposal {
  return { title: "", description: "", data: [] };
}

export const AddCollectionDataProposal = {
  encode(message: AddCollectionDataProposal, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.title !== "") {
      writer.uint32(10).string(message.title);
    }
    if (message.description !== "") {
      writer.uint32(18).string(message.description);
    }
    for (const v of message.data) {
      CollectionData.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AddCollectionDataProposal {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAddCollectionDataProposal();
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
          message.data.push(CollectionData.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): AddCollectionDataProposal {
    return {
      title: isSet(object.title) ? String(object.title) : "",
      description: isSet(object.description) ? String(object.description) : "",
      data: Array.isArray(object?.data) ? object.data.map((e: any) => CollectionData.fromJSON(e)) : [],
    };
  },

  toJSON(message: AddCollectionDataProposal): unknown {
    const obj: any = {};
    message.title !== undefined && (obj.title = message.title);
    message.description !== undefined && (obj.description = message.description);
    if (message.data) {
      obj.data = message.data.map((e) => e ? CollectionData.toJSON(e) : undefined);
    } else {
      obj.data = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<AddCollectionDataProposal>, I>>(object: I): AddCollectionDataProposal {
    const message = createBaseAddCollectionDataProposal();
    message.title = object.title ?? "";
    message.description = object.description ?? "";
    message.data = object.data?.map((e) => CollectionData.fromPartial(e)) || [];
    return message;
  },
};

function createBaseRemoveCollectionDataProposal(): RemoveCollectionDataProposal {
  return { title: "", description: "", index: [] };
}

export const RemoveCollectionDataProposal = {
  encode(message: RemoveCollectionDataProposal, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.title !== "") {
      writer.uint32(10).string(message.title);
    }
    if (message.description !== "") {
      writer.uint32(18).string(message.description);
    }
    for (const v of message.index) {
      CollectionDataIndex.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RemoveCollectionDataProposal {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRemoveCollectionDataProposal();
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
          message.index.push(CollectionDataIndex.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): RemoveCollectionDataProposal {
    return {
      title: isSet(object.title) ? String(object.title) : "",
      description: isSet(object.description) ? String(object.description) : "",
      index: Array.isArray(object?.index) ? object.index.map((e: any) => CollectionDataIndex.fromJSON(e)) : [],
    };
  },

  toJSON(message: RemoveCollectionDataProposal): unknown {
    const obj: any = {};
    message.title !== undefined && (obj.title = message.title);
    message.description !== undefined && (obj.description = message.description);
    if (message.index) {
      obj.index = message.index.map((e) => e ? CollectionDataIndex.toJSON(e) : undefined);
    } else {
      obj.index = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<RemoveCollectionDataProposal>, I>>(object: I): RemoveCollectionDataProposal {
    const message = createBaseRemoveCollectionDataProposal();
    message.title = object.title ?? "";
    message.description = object.description ?? "";
    message.index = object.index?.map((e) => CollectionDataIndex.fromPartial(e)) || [];
    return message;
  },
};

function createBaseRemoveCollectionProposal(): RemoveCollectionProposal {
  return { title: "", description: "", index: "" };
}

export const RemoveCollectionProposal = {
  encode(message: RemoveCollectionProposal, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.title !== "") {
      writer.uint32(10).string(message.title);
    }
    if (message.description !== "") {
      writer.uint32(18).string(message.description);
    }
    if (message.index !== "") {
      writer.uint32(26).string(message.index);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RemoveCollectionProposal {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRemoveCollectionProposal();
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
          message.index = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): RemoveCollectionProposal {
    return {
      title: isSet(object.title) ? String(object.title) : "",
      description: isSet(object.description) ? String(object.description) : "",
      index: isSet(object.index) ? String(object.index) : "",
    };
  },

  toJSON(message: RemoveCollectionProposal): unknown {
    const obj: any = {};
    message.title !== undefined && (obj.title = message.title);
    message.description !== undefined && (obj.description = message.description);
    message.index !== undefined && (obj.index = message.index);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<RemoveCollectionProposal>, I>>(object: I): RemoveCollectionProposal {
    const message = createBaseRemoveCollectionProposal();
    message.title = object.title ?? "";
    message.description = object.description ?? "";
    message.index = object.index ?? "";
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

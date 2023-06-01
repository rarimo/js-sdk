export const BRIDGE_ROUTER_ABI = [
  {
    inputs: [],
    name: 'BRIDGE_ROUTER_STORAGE_SLOT',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'MASTER_ROUTER_STORAGE_SLOT',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'OWNABLE_DIAMOND_STORAGE_SLOT',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'token_',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId_',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'amount_',
        type: 'uint256',
      },
      {
        components: [
          {
            internalType: 'bytes32',
            name: 'salt',
            type: 'bytes32',
          },
          {
            internalType: 'bytes',
            name: 'bundle',
            type: 'bytes',
          },
        ],
        internalType: 'struct IBundler.Bundle',
        name: 'bundle_',
        type: 'tuple',
      },
      {
        internalType: 'string',
        name: 'network_',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'receiver_',
        type: 'string',
      },
      {
        internalType: 'bool',
        name: 'isWrapped_',
        type: 'bool',
      },
    ],
    name: 'bridgeERC1155',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'token_',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount_',
        type: 'uint256',
      },
      {
        components: [
          {
            internalType: 'bytes32',
            name: 'salt',
            type: 'bytes32',
          },
          {
            internalType: 'bytes',
            name: 'bundle',
            type: 'bytes',
          },
        ],
        internalType: 'struct IBundler.Bundle',
        name: 'bundle_',
        type: 'tuple',
      },
      {
        internalType: 'string',
        name: 'network_',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'receiver_',
        type: 'string',
      },
      {
        internalType: 'bool',
        name: 'isWrapped_',
        type: 'bool',
      },
    ],
    name: 'bridgeERC20',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'token_',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId_',
        type: 'uint256',
      },
      {
        components: [
          {
            internalType: 'bytes32',
            name: 'salt',
            type: 'bytes32',
          },
          {
            internalType: 'bytes',
            name: 'bundle',
            type: 'bytes',
          },
        ],
        internalType: 'struct IBundler.Bundle',
        name: 'bundle_',
        type: 'tuple',
      },
      {
        internalType: 'string',
        name: 'network_',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'receiver_',
        type: 'string',
      },
      {
        internalType: 'bool',
        name: 'isWrapped_',
        type: 'bool',
      },
    ],
    name: 'bridgeERC721',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'amount_',
        type: 'uint256',
      },
      {
        components: [
          {
            internalType: 'bytes32',
            name: 'salt',
            type: 'bytes32',
          },
          {
            internalType: 'bytes',
            name: 'bundle',
            type: 'bytes',
          },
        ],
        internalType: 'struct IBundler.Bundle',
        name: 'bundle_',
        type: 'tuple',
      },
      {
        internalType: 'string',
        name: 'network_',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'receiver_',
        type: 'string',
      },
    ],
    name: 'bridgeNative',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getBridgeAddress',
    outputs: [
      {
        internalType: 'address',
        name: 'bridge_',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getCallerAddress',
    outputs: [
      {
        internalType: 'address',
        name: 'caller_',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'bridge_',
        type: 'address',
      },
    ],
    name: 'setBridgeAddress',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]

export const UNISWAP_V3_ROUTER = [
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
    inputs: [],
    name: 'UNISWAP_V3_ROUTER_STORAGE_SLOT',
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
        internalType: 'bool',
        name: 'isNative_',
        type: 'bool',
      },
      {
        internalType: 'address',
        name: 'receiver_',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amountIn_',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'amountOutMinimum_',
        type: 'uint256',
      },
      {
        internalType: 'bytes',
        name: 'path_',
        type: 'bytes',
      },
    ],
    name: 'exactInput',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bool',
        name: 'isNative_',
        type: 'bool',
      },
      {
        internalType: 'address',
        name: 'receiver_',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amountOut_',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'amountInMaximum_',
        type: 'uint256',
      },
      {
        internalType: 'bytes',
        name: 'path_',
        type: 'bytes',
      },
    ],
    name: 'exactOutput',
    outputs: [],
    stateMutability: 'payable',
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
    name: 'getSwapV3Router',
    outputs: [
      {
        internalType: 'address',
        name: 'swapV3Router_',
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
        name: 'swapV3Router_',
        type: 'address',
      },
    ],
    name: 'setUniswapV3RouterAddress',
    outputs: [],
    stateMutability: 'nonpayable',
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
        internalType: 'address',
        name: 'receiver_',
        type: 'address',
      },
      {
        internalType: 'uint256[]',
        name: 'tokenIds_',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256[]',
        name: 'amounts_',
        type: 'uint256[]',
      },
    ],
    name: 'transferERC1155',
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
        internalType: 'address',
        name: 'receiver_',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount_',
        type: 'uint256',
      },
    ],
    name: 'transferERC20',
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
        internalType: 'address',
        name: 'receiver_',
        type: 'address',
      },
      {
        internalType: 'uint256[]',
        name: 'nftIds_',
        type: 'uint256[]',
      },
    ],
    name: 'transferERC721',
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
        internalType: 'uint256[]',
        name: 'tokenIds_',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256[]',
        name: 'amounts_',
        type: 'uint256[]',
      },
    ],
    name: 'transferFromERC1155',
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
    ],
    name: 'transferFromERC20',
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
        internalType: 'uint256[]',
        name: 'nftIds_',
        type: 'uint256[]',
      },
    ],
    name: 'transferFromERC721',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'receiver_',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount_',
        type: 'uint256',
      },
    ],
    name: 'transferNative',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
]

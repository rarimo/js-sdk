export const TRADER_JOE_ROUTER_ABI = [
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
    name: 'TRADER_JOE_ROUTER_STORAGE_SLOT',
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
    name: 'getTraderJoeRouter',
    outputs: [
      {
        internalType: 'address',
        name: 'traderJoeRouter_',
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
        name: 'traderJoeRouter_',
        type: 'address',
      },
    ],
    name: 'setTraderJoeRouterAddress',
    outputs: [],
    stateMutability: 'nonpayable',
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
        name: 'amountOut_',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'amountInMax_',
        type: 'uint256',
      },
      {
        internalType: 'address[]',
        name: 'path_',
        type: 'address[]',
      },
    ],
    name: 'swapAVAXForExactTokens',
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
        name: 'amountIn_',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'amountOutMin_',
        type: 'uint256',
      },
      {
        internalType: 'address[]',
        name: 'path_',
        type: 'address[]',
      },
    ],
    name: 'swapExactAVAXForTokens',
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
        name: 'amountIn_',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'amountOutMin_',
        type: 'uint256',
      },
      {
        internalType: 'address[]',
        name: 'path_',
        type: 'address[]',
      },
    ],
    name: 'swapExactTokensForAVAX',
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
        name: 'amountIn_',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'amountOutMin_',
        type: 'uint256',
      },
      {
        internalType: 'address[]',
        name: 'path_',
        type: 'address[]',
      },
    ],
    name: 'swapExactTokensForTokensTJ',
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
        name: 'amountOut_',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'amountInMax_',
        type: 'uint256',
      },
      {
        internalType: 'address[]',
        name: 'path_',
        type: 'address[]',
      },
    ],
    name: 'swapTokensForExactAVAX',
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
        name: 'amountOut_',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'amountInMax_',
        type: 'uint256',
      },
      {
        internalType: 'address[]',
        name: 'path_',
        type: 'address[]',
      },
    ],
    name: 'swapTokensForExactTokensTJ',
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

export const SWAP_V3 = [
  {
    inputs: [
      {
        internalType: 'contract ISwapRouter',
        name: 'router_',
        type: 'address',
      },
      {
        internalType: 'contract IBridge',
        name: 'bridge_',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'bridge',
    outputs: [
      {
        internalType: 'contract IBridge',
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
        internalType: 'uint256',
        name: 'amountIn',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'amountOutMinimum',
        type: 'uint256',
      },
      {
        internalType: 'bytes',
        name: 'path',
        type: 'bytes',
      },
      {
        internalType: 'string',
        name: 'receiver',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'network',
        type: 'string',
      },
      {
        internalType: 'bool',
        name: 'isWrapped',
        type: 'bool',
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
    ],
    name: 'swapExactInputMultiHopThenBridge',
    outputs: [
      {
        internalType: 'uint256',
        name: 'amountOut',
        type: 'uint256',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'amountOut',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'amountInMaximum',
        type: 'uint256',
      },
      {
        internalType: 'bytes',
        name: 'path',
        type: 'bytes',
      },
      {
        internalType: 'string',
        name: 'receiver',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'network',
        type: 'string',
      },
      {
        internalType: 'bool',
        name: 'isWrapped',
        type: 'bool',
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
    ],
    name: 'swapExactOutputMultiHopThenBridge',
    outputs: [
      {
        internalType: 'uint256',
        name: 'amountIn',
        type: 'uint256',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'swapRouter',
    outputs: [
      {
        internalType: 'contract ISwapRouter',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    stateMutability: 'payable',
    type: 'receive',
  },
]

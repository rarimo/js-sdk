export const MULTICALL_ROUTER_ABI = [
  {
    inputs: [
      {
        internalType: 'address[]',
        name: 'targets_',
        type: 'address[]',
      },
      {
        internalType: 'uint256[]',
        name: 'values_',
        type: 'uint256[]',
      },
      {
        internalType: 'bytes[]',
        name: 'data_',
        type: 'bytes[]',
      },
    ],
    name: 'multicall',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
]

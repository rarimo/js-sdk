export const MULTICALL_ROUTER_ABI = [
  {
    inputs: [
      {
        internalType: 'address[]',
        name: 'targets_',
        type: 'address[]',
      },
      {
        internalType: 'bytes[]',
        name: 'data_',
        type: 'bytes[]',
      },
      {
        internalType: 'uint256[]',
        name: 'values_',
        type: 'uint256[]',
      },
    ],
    name: 'multicall',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
]

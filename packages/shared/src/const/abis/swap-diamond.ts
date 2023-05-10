export const SWAP_DIAMOND_ABI = [
  {
    stateMutability: 'payable',
    type: 'fallback',
  },
  {
    inputs: [],
    name: 'DIAMOND_STORAGE_SLOT',
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
    name: 'SWAP_DIAMOND_STORAGE_SLOT',
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
        name: 'facet_',
        type: 'address',
      },
      {
        internalType: 'bytes4[]',
        name: 'selectors_',
        type: 'bytes4[]',
      },
    ],
    name: 'addFacet',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'facet_',
        type: 'address',
      },
      {
        internalType: 'bytes4[]',
        name: 'selectors_',
        type: 'bytes4[]',
      },
      {
        internalType: 'enum SwapDiamondStorage.SelectorType[]',
        name: 'types_',
        type: 'uint8[]',
      },
    ],
    name: 'addFacet',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes4',
        name: 'selector_',
        type: 'bytes4',
      },
    ],
    name: 'getFacetBySelector',
    outputs: [
      {
        internalType: 'address',
        name: 'facet_',
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
        name: 'facet_',
        type: 'address',
      },
    ],
    name: 'getFacetSelectors',
    outputs: [
      {
        internalType: 'bytes4[]',
        name: 'selectors_',
        type: 'bytes4[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getFacets',
    outputs: [
      {
        internalType: 'address[]',
        name: 'facets_',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes4',
        name: 'selector_',
        type: 'bytes4',
      },
    ],
    name: 'getSelectorType',
    outputs: [
      {
        internalType: 'enum SwapDiamondStorage.SelectorType',
        name: 'selectorType_',
        type: 'uint8',
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
        name: 'facet_',
        type: 'address',
      },
      {
        internalType: 'bytes4[]',
        name: 'selectors_',
        type: 'bytes4[]',
      },
    ],
    name: 'removeFacet',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner_',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'facet_',
        type: 'address',
      },
      {
        internalType: 'bytes4[]',
        name: 'fromSelectors_',
        type: 'bytes4[]',
      },
      {
        internalType: 'bytes4[]',
        name: 'toSelectors_',
        type: 'bytes4[]',
      },
      {
        internalType: 'enum SwapDiamondStorage.SelectorType[]',
        name: 'toTypes_',
        type: 'uint8[]',
      },
    ],
    name: 'updateFacet',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'facet_',
        type: 'address',
      },
      {
        internalType: 'bytes4[]',
        name: 'fromSelectors_',
        type: 'bytes4[]',
      },
      {
        internalType: 'bytes4[]',
        name: 'toSelectors_',
        type: 'bytes4[]',
      },
    ],
    name: 'updateFacet',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    stateMutability: 'payable',
    type: 'receive',
  },
]

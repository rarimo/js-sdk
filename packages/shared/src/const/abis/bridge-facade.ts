export const BRIDGE_FACADE_ABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'feeToken',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'feeAmount',
        type: 'uint256',
      },
    ],
    name: 'AddedFeeToken',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'previousAdmin',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'newAdmin',
        type: 'address',
      },
    ],
    name: 'AdminChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'beacon',
        type: 'address',
      },
    ],
    name: 'BeaconUpgraded',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint8',
        name: 'version',
        type: 'uint8',
      },
    ],
    name: 'Initialized',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'feeToken',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'feeAmount',
        type: 'uint256',
      },
    ],
    name: 'RemovedFeeToken',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'feeToken',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'feeAmount',
        type: 'uint256',
      },
    ],
    name: 'UpdatedFeeToken',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'implementation',
        type: 'address',
      },
    ],
    name: 'Upgraded',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'receiver',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'feeToken',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'WithdrawnFeeToken',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'bridge_',
        type: 'address',
      },
    ],
    name: '__BridgeFacade_init',
    outputs: [],
    stateMutability: 'nonpayable',
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
    name: '__FeeManager_init',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address[]',
            name: 'feeTokens',
            type: 'address[]',
          },
          {
            internalType: 'uint256[]',
            name: 'feeAmounts',
            type: 'uint256[]',
          },
          {
            internalType: 'bytes',
            name: 'signature',
            type: 'bytes',
          },
        ],
        internalType: 'struct IFeeManager.AddFeeTokenParameters',
        name: 'params_',
        type: 'tuple',
      },
    ],
    name: 'addFeeToken',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'bridge',
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
        components: [
          {
            internalType: 'address',
            name: 'feeToken',
            type: 'address',
          },
        ],
        internalType: 'struct IBridgeFacade.DepositFeeERC1155Parameters',
        name: 'feeParams_',
        type: 'tuple',
      },
      {
        components: [
          {
            internalType: 'address',
            name: 'token',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'tokenId',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'amount',
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
            name: 'bundle',
            type: 'tuple',
          },
          {
            internalType: 'string',
            name: 'network',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'receiver',
            type: 'string',
          },
          {
            internalType: 'bool',
            name: 'isWrapped',
            type: 'bool',
          },
        ],
        internalType: 'struct IERC1155Handler.DepositERC1155Parameters',
        name: 'depositParams_',
        type: 'tuple',
      },
    ],
    name: 'depositERC1155',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'feeToken',
            type: 'address',
          },
        ],
        internalType: 'struct IBridgeFacade.DepositFeeERC20Parameters',
        name: 'feeParams_',
        type: 'tuple',
      },
      {
        components: [
          {
            internalType: 'address',
            name: 'token',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'amount',
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
            name: 'bundle',
            type: 'tuple',
          },
          {
            internalType: 'string',
            name: 'network',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'receiver',
            type: 'string',
          },
          {
            internalType: 'bool',
            name: 'isWrapped',
            type: 'bool',
          },
        ],
        internalType: 'struct IERC20Handler.DepositERC20Parameters',
        name: 'depositParams_',
        type: 'tuple',
      },
    ],
    name: 'depositERC20',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'feeToken',
            type: 'address',
          },
        ],
        internalType: 'struct IBridgeFacade.DepositFeeERC721Parameters',
        name: 'feeParams_',
        type: 'tuple',
      },
      {
        components: [
          {
            internalType: 'address',
            name: 'token',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'tokenId',
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
            name: 'bundle',
            type: 'tuple',
          },
          {
            internalType: 'string',
            name: 'network',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'receiver',
            type: 'string',
          },
          {
            internalType: 'bool',
            name: 'isWrapped',
            type: 'bool',
          },
        ],
        internalType: 'struct IERC721Handler.DepositERC721Parameters',
        name: 'depositParams_',
        type: 'tuple',
      },
    ],
    name: 'depositERC721',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'feeToken',
            type: 'address',
          },
        ],
        internalType: 'struct IBridgeFacade.DepositFeeNativeParameters',
        name: 'feeParams_',
        type: 'tuple',
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'amount',
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
            name: 'bundle',
            type: 'tuple',
          },
          {
            internalType: 'string',
            name: 'network',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'receiver',
            type: 'string',
          },
        ],
        internalType: 'struct INativeHandler.DepositNativeParameters',
        name: 'depositParams_',
        type: 'tuple',
      },
    ],
    name: 'depositNative',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'feeToken',
            type: 'address',
          },
        ],
        internalType: 'struct IBridgeFacade.DepositFeeSBTParameters',
        name: 'feeParams_',
        type: 'tuple',
      },
      {
        components: [
          {
            internalType: 'address',
            name: 'token',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'tokenId',
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
            name: 'bundle',
            type: 'tuple',
          },
          {
            internalType: 'string',
            name: 'network',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'receiver',
            type: 'string',
          },
        ],
        internalType: 'struct ISBTHandler.DepositSBTParameters',
        name: 'depositParams_',
        type: 'tuple',
      },
    ],
    name: 'depositSBT',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'feeToken_',
        type: 'address',
      },
    ],
    name: 'getCommission',
    outputs: [
      {
        internalType: 'uint256',
        name: 'commission_',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'proxiableUUID',
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
        components: [
          {
            internalType: 'address[]',
            name: 'feeTokens',
            type: 'address[]',
          },
          {
            internalType: 'uint256[]',
            name: 'feeAmounts',
            type: 'uint256[]',
          },
          {
            internalType: 'bytes',
            name: 'signature',
            type: 'bytes',
          },
        ],
        internalType: 'struct IFeeManager.RemoveFeeTokenParameters',
        name: 'params_',
        type: 'tuple',
      },
    ],
    name: 'removeFeeToken',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address[]',
            name: 'feeTokens',
            type: 'address[]',
          },
          {
            internalType: 'uint256[]',
            name: 'feeAmounts',
            type: 'uint256[]',
          },
          {
            internalType: 'bytes',
            name: 'signature',
            type: 'bytes',
          },
        ],
        internalType: 'struct IFeeManager.UpdateFeeTokenParameters',
        name: 'params_',
        type: 'tuple',
      },
    ],
    name: 'updateFeeToken',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newImplementation',
        type: 'address',
      },
    ],
    name: 'upgradeTo',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newImplementation',
        type: 'address',
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes',
      },
    ],
    name: 'upgradeToAndCall',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newImplementation_',
        type: 'address',
      },
      {
        internalType: 'bytes',
        name: 'signature_',
        type: 'bytes',
      },
    ],
    name: 'upgradeToWithSig',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'token',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'tokenId',
            type: 'uint256',
          },
          {
            internalType: 'string',
            name: 'tokenURI',
            type: 'string',
          },
          {
            internalType: 'uint256',
            name: 'amount',
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
            name: 'bundle',
            type: 'tuple',
          },
          {
            internalType: 'bytes32',
            name: 'originHash',
            type: 'bytes32',
          },
          {
            internalType: 'address',
            name: 'receiver',
            type: 'address',
          },
          {
            internalType: 'bytes',
            name: 'proof',
            type: 'bytes',
          },
          {
            internalType: 'bool',
            name: 'isWrapped',
            type: 'bool',
          },
        ],
        internalType: 'struct IERC1155Handler.WithdrawERC1155Parameters',
        name: 'params_',
        type: 'tuple',
      },
    ],
    name: 'withdrawERC1155',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'token',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'amount',
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
            name: 'bundle',
            type: 'tuple',
          },
          {
            internalType: 'bytes32',
            name: 'originHash',
            type: 'bytes32',
          },
          {
            internalType: 'address',
            name: 'receiver',
            type: 'address',
          },
          {
            internalType: 'bytes',
            name: 'proof',
            type: 'bytes',
          },
          {
            internalType: 'bool',
            name: 'isWrapped',
            type: 'bool',
          },
        ],
        internalType: 'struct IERC20Handler.WithdrawERC20Parameters',
        name: 'params_',
        type: 'tuple',
      },
    ],
    name: 'withdrawERC20',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'token',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'tokenId',
            type: 'uint256',
          },
          {
            internalType: 'string',
            name: 'tokenURI',
            type: 'string',
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
            name: 'bundle',
            type: 'tuple',
          },
          {
            internalType: 'bytes32',
            name: 'originHash',
            type: 'bytes32',
          },
          {
            internalType: 'address',
            name: 'receiver',
            type: 'address',
          },
          {
            internalType: 'bytes',
            name: 'proof',
            type: 'bytes',
          },
          {
            internalType: 'bool',
            name: 'isWrapped',
            type: 'bool',
          },
        ],
        internalType: 'struct IERC721Handler.WithdrawERC721Parameters',
        name: 'params_',
        type: 'tuple',
      },
    ],
    name: 'withdrawERC721',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'receiver',
            type: 'address',
          },
          {
            internalType: 'address[]',
            name: 'feeTokens',
            type: 'address[]',
          },
          {
            internalType: 'uint256[]',
            name: 'amounts',
            type: 'uint256[]',
          },
          {
            internalType: 'bytes',
            name: 'signature',
            type: 'bytes',
          },
        ],
        internalType: 'struct IFeeManager.WithdrawFeeTokenParameters',
        name: 'params_',
        type: 'tuple',
      },
    ],
    name: 'withdrawFeeToken',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'amount',
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
            name: 'bundle',
            type: 'tuple',
          },
          {
            internalType: 'bytes32',
            name: 'originHash',
            type: 'bytes32',
          },
          {
            internalType: 'address',
            name: 'receiver',
            type: 'address',
          },
          {
            internalType: 'bytes',
            name: 'proof',
            type: 'bytes',
          },
        ],
        internalType: 'struct INativeHandler.WithdrawNativeParameters',
        name: 'params_',
        type: 'tuple',
      },
    ],
    name: 'withdrawNative',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'token',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'tokenId',
            type: 'uint256',
          },
          {
            internalType: 'string',
            name: 'tokenURI',
            type: 'string',
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
            name: 'bundle',
            type: 'tuple',
          },
          {
            internalType: 'bytes32',
            name: 'originHash',
            type: 'bytes32',
          },
          {
            internalType: 'address',
            name: 'receiver',
            type: 'address',
          },
          {
            internalType: 'bytes',
            name: 'proof',
            type: 'bytes',
          },
        ],
        internalType: 'struct ISBTHandler.WithdrawSBTParameters',
        name: 'params_',
        type: 'tuple',
      },
    ],
    name: 'withdrawSBT',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]

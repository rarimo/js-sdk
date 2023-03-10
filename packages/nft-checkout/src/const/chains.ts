import { ChainTypes } from '@rarimo/provider'

import { ChainNames, SwapContractVersion } from '@/enums'
import { BridgeChain } from '@/types'

const EVM_CHAIN_IDS = {
  [ChainNames.Ethereum]: 1,
  [ChainNames.Polygon]: 137,
  [ChainNames.Fuji]: 43113,
  [ChainNames.Avalanche]: 43114,
  [ChainNames.Goerli]: 5,
  [ChainNames.Sepolia]: 11155111,
  [ChainNames.Mumbai]: 80001,
  [ChainNames.BinanceSmartChain]: 56,
  [ChainNames.Chapel]: 97,
}

const nativeToken = {
  decimals: 18,
}

export const EVM_CHAINS: BridgeChain[] = [
  {
    id: EVM_CHAIN_IDS[ChainNames.Ethereum],
    name: ChainNames.Ethereum,
    rpcUrl: 'https://mainnet.infura.io/v3/',
    token: {
      symbol: 'ETH',
      name: 'Ethereum',
      ...nativeToken,
    },
    explorerUrl: 'https://etherscan.io',
    type: ChainTypes.EVM,
    icon: 'https://raw.githubusercontent.com/MetaMask/metamask-extension/develop/app/images/eth_logo.svg',
    contractAddress: '0x85718348D854CE2768e96D87a2ed6d12d619b67B',
    contactVersion: SwapContractVersion.UniswapV3,
  },
  {
    id: EVM_CHAIN_IDS[ChainNames.Goerli],
    name: ChainNames.Goerli,
    rpcUrl: 'https://goerli.infura.io/v3/',
    token: {
      symbol: 'ETH',
      name: 'Goerli Ethereum',
      ...nativeToken,
    },
    explorerUrl: 'https://goerli.etherscan.io',
    type: ChainTypes.EVM,
    icon: 'https://raw.githubusercontent.com/MetaMask/metamask-extension/develop/app/images/eth_logo.svg',
    contractAddress: '0xe3C6b16AFAB73D836f12252f376613ceF967B5e1',
    contactVersion: SwapContractVersion.UniswapV3,
  },
  {
    id: EVM_CHAIN_IDS[ChainNames.Sepolia],
    name: ChainNames.Sepolia,
    rpcUrl: 'https://sepolia.infura.io/v3/',
    token: {
      symbol: 'ETH',
      name: 'Sepolia Ethereum',
      ...nativeToken,
    },
    explorerUrl: 'https://sepolia.etherscan.io',
    type: ChainTypes.EVM,
    icon: 'https://raw.githubusercontent.com/MetaMask/metamask-extension/develop/app/images/eth_logo.svg',
    contractAddress: '',
    contactVersion: SwapContractVersion.UniswapV3,
  },
  {
    id: EVM_CHAIN_IDS[ChainNames.Polygon],
    name: ChainNames.Polygon,
    rpcUrl: 'https://polygon-rpc.com/',
    token: {
      symbol: 'MATIC',
      name: 'Polygon Matic',
      ...nativeToken,
    },
    explorerUrl: 'https://polygonscan.com',
    type: ChainTypes.EVM,
    icon: 'https://raw.githubusercontent.com/MetaMask/metamask-extension/develop/app/images/matic-token.png',
    contractAddress: '',
    contactVersion: SwapContractVersion.QuickSwap,
  },
  {
    id: EVM_CHAIN_IDS[ChainNames.Mumbai],
    name: ChainNames.Mumbai,
    rpcUrl: 'https://rpc-mumbai.maticvigil.com/',
    token: {
      symbol: 'MATIC',
      name: 'Polygon Mumbai Matic',
      ...nativeToken,
    },
    explorerUrl: 'https://mumbai.polygonscan.com',
    type: ChainTypes.EVM,
    contractAddress: '0x24Ae0B9DC81d2E4e9383e283163913BF200a579F',
    icon: 'https://raw.githubusercontent.com/MetaMask/metamask-extension/develop/app/images/matic-token.png',
    contactVersion: SwapContractVersion.QuickSwap,
  },
  {
    id: EVM_CHAIN_IDS[ChainNames.Avalanche],
    name: ChainNames.Avalanche,
    rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
    token: {
      symbol: 'AVAX',
      name: 'Avalanche',
      ...nativeToken,
    },
    explorerUrl: 'https://snowtrace.io',
    type: ChainTypes.EVM,
    contractAddress: '0x2021Fa349Ec57F33F03961E430f54d9b05781E3c',
    icon: 'https://github.com/MetaMask/metamask-extension/blob/develop/app/images/avax-token.png',
    contactVersion: SwapContractVersion.TraderJoe,
  },
  {
    id: EVM_CHAIN_IDS[ChainNames.Fuji],
    name: ChainNames.Fuji,
    rpcUrl: 'https://api.avax-test.network/ext/bc/C/rpc',
    token: {
      symbol: 'AVAX',
      name: 'Fuji Avalanche',
      ...nativeToken,
    },
    explorerUrl: 'https://testnet.snowtrace.io',
    type: ChainTypes.EVM,
    icon: 'https://github.com/MetaMask/metamask-extension/blob/develop/app/images/avax-token.png',
    contractAddress: '0x13734D554d25EA67DFD45653659e447996a1C9B4',
    contactVersion: SwapContractVersion.TraderJoe,
  },
  {
    id: EVM_CHAIN_IDS[ChainNames.BinanceSmartChain],
    name: ChainNames.BinanceSmartChain,
    rpcUrl: 'https://bsc-dataseed.binance.org/',
    token: {
      symbol: 'BNB',
      name: 'Binance Coin',
      ...nativeToken,
    },
    explorerUrl: 'https://bscscan.com',
    type: ChainTypes.EVM,
    icon: 'https://raw.githubusercontent.com/MetaMask/metamask-extension/develop/app/images/bnb.png',
    contractAddress: '0x85718348D854CE2768e96D87a2ed6d12d619b67B',
    contactVersion: SwapContractVersion.PancakeSwap,
  },
  {
    id: EVM_CHAIN_IDS[ChainNames.Chapel],
    name: ChainNames.Chapel,
    rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
    token: {
      symbol: 'tBNB',
      name: 'Binance Testnet Coin',
      ...nativeToken,
    },
    explorerUrl: 'https://testnet.bscscan.com',
    type: ChainTypes.EVM,
    icon: 'https://raw.githubusercontent.com/MetaMask/metamask-extension/develop/app/images/bnb.png',
    contractAddress: '0x08a87595f4423AaF591155aa2cEF31Fb904BcdE8',
    contactVersion: SwapContractVersion.PancakeSwap,
  },
]

export const CHAINS: Readonly<{ [key in ChainTypes]?: BridgeChain[] }> = {
  [ChainTypes.EVM]: EVM_CHAINS,
}

export const CHAIN_IDS = {
  [ChainTypes.EVM]: EVM_CHAIN_IDS,
}

export { ChainTypes }

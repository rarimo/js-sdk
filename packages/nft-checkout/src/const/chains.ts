import { ChainTypes } from '@rarimo/provider'
import { BridgeChain } from '@/types'
import { ChainNames, SwapContractVersion } from '@/enums'

const EVM_CHAIN_IDS = {
  [ChainNames.Ethereum]: 1,
  [ChainNames.Polygon]: 137,
  [ChainNames.Fuji]: 43113,
  [ChainNames.Avalanche]: 43114,
  [ChainNames.Goerli]: 5,
  [ChainNames.Sepolia]: 11155111,
  [ChainNames.Mumbai]: 80001,
}

const EVM_CHAINS: BridgeChain[] = [
  {
    id: EVM_CHAIN_IDS[ChainNames.Ethereum],
    name: ChainNames.Ethereum,
    rpcUrl: 'https://mainnet.infura.io/v3/',
    symbol: 'ETH',
    explorerUrl: 'https://etherscan.io',
    type: ChainTypes.EVM,
    icon: 'https://chainlist.org/_next/image?url=https%3A%2F%2Fdefillama.com%2Fchain-icons%2Frsz_ethereum.jpg&w=32&q=75',
    contractAddress: '0xe3C6b16AFAB73D836f12252f376613ceF967B5e1',
    contactVersion: SwapContractVersion.UniswapV3,
  },
  {
    id: EVM_CHAIN_IDS[ChainNames.Polygon],
    name: ChainNames.Polygon,
    rpcUrl: 'https://polygon-mainnet.infura.io/v3/',
    symbol: 'MATIC',
    explorerUrl: 'https://polygonscan.com',
    type: ChainTypes.EVM,
    icon: 'https://chainlist.org/_next/image?url=https%3A%2F%2Fdefillama.com%2Fchain-icons%2Frsz_polygon.jpg&w=32&q=75',
    contractAddress: '0xe3C6b16AFAB73D836f12252f376613ceF967B5e1',
    contactVersion: SwapContractVersion.UniswapV3,
  },
  {
    id: EVM_CHAIN_IDS[ChainNames.Avalanche],
    name: ChainNames.Avalanche,
    rpcUrl: 'https://avalanche-mainnet.infura.io/v3/',
    symbol: 'AVAX',
    explorerUrl: 'https://cchain.explorer.avax.network',
    type: ChainTypes.EVM,
    icon: 'https://chainlist.org/_next/image?url=https%3A%2F%2Fdefillama.com%2Fchain-icons%2Frsz_avalanche.jpg&w=64&q=75',
    contractAddress: '0xA009003BA2c6Af4C77cD1E6c3512723EC2Bdb5eE',
    contactVersion: SwapContractVersion.AvalancheV2,
  },
  {
    id: EVM_CHAIN_IDS[ChainNames.Goerli],
    name: 'Görli',
    rpcUrl: 'https://goerli.infura.io/v3/',
    symbol: 'ETH',
    explorerUrl: 'https://goerli.etherscan.io',
    type: ChainTypes.EVM,
    icon: 'https://chainlist.org/_next/image?url=https%3A%2F%2Fdefillama.com%2Fchain-icons%2Frsz_ethereum.jpg&w=32&q=75',
    contractAddress: '0xe3C6b16AFAB73D836f12252f376613ceF967B5e1',
    contactVersion: SwapContractVersion.UniswapV3,
  },
  {
    id: EVM_CHAIN_IDS[ChainNames.Sepolia],
    name: 'Sepolia',
    rpcUrl: 'https://sepolia.infura.io/v3/',
    symbol: 'ETH',
    explorerUrl: 'https://sepolia.etherscan.io',
    type: ChainTypes.EVM,
    icon: 'https://chainlist.org/_next/image?url=https%3A%2F%2Fdefillama.com%2Fchain-icons%2Frsz_ethereum.jpg&w=32&q=75',
    contractAddress: '0xe3C6b16AFAB73D836f12252f376613ceF967B5e1',
    contactVersion: SwapContractVersion.UniswapV3,
  },
  {
    id: EVM_CHAIN_IDS[ChainNames.Fuji],
    name: ChainNames.Fuji,
    rpcUrl: 'https://avalanche-fuji.infura.io/v3/',
    symbol: 'AVAX',
    explorerUrl: 'https://cchain.explorer.avax-test.network',
    type: ChainTypes.EVM,
    icon: 'https://chainlist.org/_next/image?url=https%3A%2F%2Fdefillama.com%2Fchain-icons%2Frsz_avalanche.jpg&w=64&q=75',
    contractAddress: '0xA009003BA2c6Af4C77cD1E6c3512723EC2Bdb5eE',
    contactVersion: SwapContractVersion.AvalancheV2,
  },
  {
    id: EVM_CHAIN_IDS[ChainNames.Mumbai],
    name: ChainNames.Mumbai,
    rpcUrl: 'https://polygon-mumbai.infura.io/v3/',
    symbol: 'MATIC',
    explorerUrl: 'https://mumbai.polygonscan.com',
    type: ChainTypes.EVM,
    icon: 'https://chainlist.org/_next/image?url=%2Funknown-logo.png&w=64&q=75',
    contractAddress: '0xe3C6b16AFAB73D836f12252f376613ceF967B5e1',
    contactVersion: SwapContractVersion.UniswapV3,
  },
]

export const CHAINS: Readonly<{ [key in ChainTypes]?: BridgeChain[] }> = {
  [ChainTypes.EVM]: EVM_CHAINS,
}

export const CHAIN_IDS = {
  [ChainTypes.EVM]: EVM_CHAIN_IDS,
}
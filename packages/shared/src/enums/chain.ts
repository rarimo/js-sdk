export enum ChainNames {
  Ethereum = 'Ethereum',
  Polygon = 'Polygon',
  Avalanche = 'Avalanche',
  Goerli = 'Goerli',
  Sepolia = 'Sepolia',
  Mumbai = 'Mumbai',
  Fuji = 'fuji',
  BinanceSmartChain = 'BSC',
  Chapel = 'Binance Smart Chain Testnet',

  // Not supported yet for nft-checkout
  NearMainNet = 'Near MainNet',
  NearTestNet = 'Near TestNet',
  SolanaMainNet = 'Solana MainNet',
  SolanaTestNet = 'Solana TestNet',
  SolanaDevNet = 'Solana DevNet',
}

export enum EVMSwapContractVersion {
  TraderJoe = 'TraderJoe',
  QuickSwap = 'QuickSwap',
  PancakeSwap = 'PancakeSwap',
  UniswapV3 = 'UniswapV3',
}

export enum ChainTypes {
  EVM = 1,
  Solana = 2,
  Near = 3,
}

export enum MainnetChainName {
  ethereum = 'ethereum',
  polygon = 'polygon',
  avalanche = 'avalanche',
  solana = 'solana',
  near = 'near',
  bsc = 'binance-smart-chain', // update this if needed
}

export enum TestnetChainName {
  goerli = 'goerli',
  mumbai = 'mumbai',
  fuji = 'fuji',
}

export const ChainName = { ...MainnetChainName, ...TestnetChainName }
export type ChainName = MainnetChainName | TestnetChainName //typeof ChainName;

export enum MainnetChainIds {
  ethereum = 1,
  polygon = 137,
  avalanche = 43114,
}

export enum TestnetChainIds {
  goerli = 5,
  mumbai = 80001,
  fuji = 43113,
}

export const ChainIds = { ...MainnetChainIds, ...TestnetChainIds }
export type ChainIds = MainnetChainIds | TestnetChainIds //typeof ChainName;

export const CHAIN_NAMES_TO_IDS: { [chainName: string]: ChainIds } = {
  [ChainName.ethereum]: ChainIds.ethereum,
  [ChainName.goerli]: ChainIds.goerli,

  [ChainName.polygon]: ChainIds.polygon,
  [ChainName.mumbai]: ChainIds.mumbai,

  [ChainName.avalanche]: ChainIds.avalanche,
  [ChainName.fuji]: ChainIds.fuji,
}

export const CHAIN_IDS_TO_NAMES: { [chainId: number]: ChainName } = {
  [ChainIds.ethereum]: ChainName.ethereum,
  [ChainIds.goerli]: ChainName.goerli,

  [ChainIds.polygon]: ChainName.polygon,
  [ChainIds.mumbai]: ChainName.mumbai,

  [ChainIds.avalanche]: ChainName.avalanche,
  [ChainIds.fuji]: ChainName.fuji,
}

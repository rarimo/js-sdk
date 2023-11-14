export enum TokenType {
  Native = 0,
  Erc20 = 1,
  Erc721 = 2,
  Erc1155 = 3,
  MetaplexNft = 4,
  MetaplexFt = 5,
  NearFt = 6,
  NearNft = 7,
  Unrecognized = -1,
}

export enum NetworkType {
  EVM = 0,
  Solana = 1,
  Near = 2,
  Other = 3,
  Unrecognized = -1,
}

export enum UpgradeType {
  None = 0,
  BasicImplementation = 1,
  Other = 2,
  Unrecognized = -1,
}

export enum NetworkParamType {
  Bridge = 0,
  Fee = 1,
  Identity = 2,
  Unrecognized = -1,
}

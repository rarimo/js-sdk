export enum SwapCommands {
  Undefined = 0,
  // bridge
  BridgeErc20 = 1,
  BridgeErc721 = 2,
  BridgeErc1155 = 3,
  BridgeNative = 4,
  // token transfer
  TransferErc20 = 10,
  TransferErc721 = 11,
  TransferErc1155 = 12,
  TransferNative = 13,
  TransferFromErc20 = 14,
  TransferFromErc721 = 15,
  TransferFromErc1155 = 16,
  // wrap/unwrap
  WrapNative = 20,
  UnwrapNative = 21,
  // multicall
  Multicall = 25,
  // UniswapV2
  SwapExactTokensForTokensV2 = 50,
  SwapTokensForExactTokensV2 = 51,
  SwapExactEthForTokens = 52,
  SwapTokensForExactEth = 53,
  SwapExactTokensForEth = 54,
  SwapEthForExactTokens = 55,
  // UniswapV3
  ExactInput = 60,
  ExactOutput = 61,
  // Trader Joe
  SwapExactTokensForTokensTj = 70,
  SwapTokensForExactTokensTj = 71,
  SwapExactAvaxForTokens = 72,
  SwapTokensForExactAvax = 73,
  SwapExactTokensForAvax = 74,
  SwapAvaxForExactTokens = 75,
}

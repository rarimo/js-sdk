import type { ChainId } from '@rarimo/shared'
import { ChainNames, EVM_CHAIN_IDS } from '@rarimo/shared'

import { SwapCommands } from '@/enums'

export const CONTRACT_BALANCE =
  '0x8000000000000000000000000000000000000000000000000000000000000000'
export const THIS_ADDRESS = '0x0000000000000000000000000000000000000001'
export const CALLER_ADDRESS = '0x0000000000000000000000000000000000000002'

const IDS = EVM_CHAIN_IDS as { [key in ChainNames]: ChainId }

export const WRAPPED_CHAIN_TOKEN_SYMBOLS = {
  // Ethereum
  [IDS[ChainNames.Ethereum]]: 'WETH',
  [IDS[ChainNames.Goerli]]: 'WETH',
  [IDS[ChainNames.Sepolia]]: 'WETH',
  // Polygon
  [IDS[ChainNames.Polygon]]: 'WMATIC',
  [IDS[ChainNames.Mumbai]]: 'WMATIC',
  // Avalanche
  [IDS[ChainNames.Avalanche]]: 'WAVAX',
  [IDS[ChainNames.Fuji]]: 'WAVAX',
  // BSC
  [IDS[ChainNames.BinanceSmartChain]]: 'WBNB',
  [IDS[ChainNames.Chapel]]: 'WBNB',
}

export const SWAP_COMMANDS_NAME_MAP: { [key in SwapCommands]?: string } = {
  [SwapCommands.BridgeErc20]: 'bridgeERC20',
  [SwapCommands.BridgeErc721]: 'bridgeERC721',
  [SwapCommands.BridgeErc1155]: 'bridgeERC1155',
  [SwapCommands.BridgeNative]: 'bridgeNative',
  [SwapCommands.TransferErc20]: 'transferERC20',
  [SwapCommands.TransferErc721]: 'transferERC721',
  [SwapCommands.TransferErc1155]: 'transferERC1155',
  [SwapCommands.TransferNative]: 'transferNative',
  [SwapCommands.TransferFromErc20]: 'transferFromERC20',
  [SwapCommands.TransferFromErc721]: 'transferFromERC721',
  [SwapCommands.TransferFromErc1155]: 'transferFromERC1155',
  [SwapCommands.WrapNative]: 'wrap',
  [SwapCommands.UnwrapNative]: 'unwrap',
  [SwapCommands.Multicall]: 'multicall',
  [SwapCommands.SwapExactTokensForTokensV2]: 'swapExactTokensForTokensV2',
  [SwapCommands.SwapTokensForExactTokensV2]: 'swapTokensForExactTokensV2',
  [SwapCommands.SwapExactEthForTokens]: 'swapExactETHForTokens',
  [SwapCommands.SwapTokensForExactEth]: 'swapTokensForExactETH',
  [SwapCommands.SwapExactTokensForEth]: 'swapExactTokensForETH',
  [SwapCommands.SwapEthForExactTokens]: 'swapETHForExactTokens',
  [SwapCommands.ExactInput]: 'exactInput',
  [SwapCommands.ExactOutput]: 'exactOutput',
  [SwapCommands.SwapExactTokensForTokensTj]: 'swapExactTokensForTokensTJ',
  [SwapCommands.SwapTokensForExactTokensTj]: 'swapTokensForExactTokensTJ',
  [SwapCommands.SwapExactAvaxForTokens]: 'swapExactAVAXForTokens',
  [SwapCommands.SwapTokensForExactAvax]: 'swapTokensForExactAVAX',
  [SwapCommands.SwapExactTokensForAvax]: 'swapExactTokensForAVAX',
  [SwapCommands.SwapAvaxForExactTokens]: 'swapAVAXForExactTokens',
}

import { CHAIN_IDS } from '@/const'
import { ChainTypes } from '@rarimo/provider'
import { ChainNames } from '@/enums'

const chainsIDs = CHAIN_IDS[ChainTypes.EVM]

export const isEthereum = (chainId: number): boolean => {
  return {
    [chainsIDs[ChainNames.Ethereum]]: true,
    [chainsIDs[ChainNames.Goerli]]: true,
    [chainsIDs[ChainNames.Polygon]]: true,
    [chainsIDs[ChainNames.Mumbai]]: true,
  }[chainId]
}

export const isAvalanche = (chainId: number): boolean => {
  return {
    [chainsIDs[ChainNames.Fuji]]: true,
    [chainsIDs[ChainNames.Avalanche]]: true,
  }[chainId]
}

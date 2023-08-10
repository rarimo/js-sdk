import type { ChainInfo } from '@keplr-wallet/types'

import { makeRarimoQuerier } from '@/querier'
import type { Config } from '@/types'

export const getChainInfo = async (
  config: Config,
  querier: Awaited<ReturnType<typeof makeRarimoQuerier>>,
): Promise<ChainInfo> => {
  const status = await querier.getNodeStatus()
  const chainId = status?.default_node_info?.network ?? ''
  const addrPrefix = config.prefix

  const currency = {
    coinDenom: config.currency.denom,
    coinMinimalDenom: config.currency.minDenom,
    coinDecimals: config.currency.decimals,
  }

  return {
    chainId,
    chainName: config.chainName,
    chainSymbolImageUrl: config.chainIconUrl,
    rpc: config.rpcUrl,
    rest: config.apiUrl,
    stakeCurrency: currency,
    currencies: [currency],
    feeCurrencies: [
      {
        ...currency,
        gasPriceStep: config.gasPriceSteps,
      },
    ],
    bip44: {
      coinType: 118,
    },
    bech32Config: {
      bech32PrefixAccAddr: addrPrefix,
      bech32PrefixAccPub: addrPrefix + 'pub',
      bech32PrefixValAddr: addrPrefix + 'valoper',
      bech32PrefixValPub: addrPrefix + 'valoperpub',
      bech32PrefixConsAddr: addrPrefix + 'valcons',
      bech32PrefixConsPub: addrPrefix + 'valconspub',
    },
  }
}

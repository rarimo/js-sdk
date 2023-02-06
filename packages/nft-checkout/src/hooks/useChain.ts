import axios from 'axios'
import { mapRarimoChains } from '@/utils/map-rarimo-chains'
import { CONFIG } from '@/config'
import { Chain } from '@/types'

const useRarimoSupportedChains = async (chainList?: Chain[]) => {
  if (chainList?.length)
    return { chains: chainList, isLoading: false, isError: false }

  // default fallback - if user didn't pass in chains, use all supported chains
  const getChainsEndpoint = `${CONFIG.API_URL}/chains`

  const { data } = await axios.get(getChainsEndpoint)

  let chains
  if (data) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    chains = data?.data?.map(({ attributes }: { attributes: any }) =>
      mapRarimoChains(attributes),
    )
  }

  return {
    chains,
    // isLoading: !error && !data,
    // isError: error,
  }
}

export { useRarimoSupportedChains }

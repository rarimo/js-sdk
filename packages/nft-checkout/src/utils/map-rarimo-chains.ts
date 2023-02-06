// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mapRarimoChains = (attributes: any) => ({
  contractAddress: attributes.bridge_contract,
  chainId: attributes?.chain_params?.chain_id,
  symbol: attributes?.chain_params?.native_symbol,
  chainType: attributes.chain_type,
  icon: attributes.icon,
  name: attributes.name,
})

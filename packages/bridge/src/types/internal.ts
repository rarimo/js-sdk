import type { JsonApiRecordBase } from '@distributedlab/jac'

export type InternalChain = JsonApiRecordBase<'chain'> & {
  bridge_contract: string
  chain_params: string | null
  chain_type: string
  name: string
  token_address: string
}

export type InternalToken = JsonApiRecordBase<'token'> & {
  name: string
  symbol: string
  token_type: string
  chains: InternalChain[]
}

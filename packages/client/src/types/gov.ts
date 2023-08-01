import type { Coin } from './bank'
import type { BaseModel } from './base'

export type VotingParams = {
  voting_period: string
}

export type DepositParams = {
  min_deposit: Coin[]
  max_deposit_period: string
}

export type TallyParams = {
  quorum: string
  threshold: string
  veto_threshold: string
}

export type GovParams = {
  voting_params: VotingParams | null
  deposit_params: DepositParams | null
  tally_params: TallyParams | null
}

export type FinalTallyResult = {
  yes_count: string
  abstain_count: string
  no_count: string
  no_with_veto_count: string
}

export type Proposal = {
  id: string
  messages: BaseModel<string>[]
  status: string
  final_tally_result?: FinalTallyResult
  submit_block: string
  deposit_end_block: string
  total_deposit: Coin[]
  voting_start_block: string
  voting_end_block: string
  metadata: string
}

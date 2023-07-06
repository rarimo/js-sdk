import { SwapCommands } from '@/enums'

export type CommandPayload = {
  command: SwapCommands
  skipRevert: boolean
  data: string
}

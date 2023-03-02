import { OperationEventBusEvents } from '../enums'
import { BridgeChain } from './common'
import { Target } from './operation'

export type OperationInitiatedEventPayload = {
  isInitiated: boolean
  chainFrom: BridgeChain
  target?: Target
}

export type OperationEventMap = {
  [OperationEventBusEvents.Initiated]: {
    isInitiated: boolean
    chainFrom: BridgeChain
    target?: Target
  }
}

export interface OperationSubscriber {
  onInitiated(cb: (e: OperationInitiatedEventPayload) => void): void
  clearHandlers(): void
}

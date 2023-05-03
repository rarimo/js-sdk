import type { BridgeChain } from '@rarimo/core'

import { OperationEventBusEvents } from '@/enums'

import type { Target } from './operation'

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
  onInitiated(cb: (e?: OperationInitiatedEventPayload) => void): void
  clearHandlers(): void
}

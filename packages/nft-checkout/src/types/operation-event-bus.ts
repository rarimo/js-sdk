import { OperationEventBusEvents } from '@/enums'

import type { BridgeChain } from './common'
import type { Target } from './operation'
import type { CheckoutOperationStatus } from './operation'

export type OperationEventPayload = {
  isInitiated: boolean
  chainFrom: BridgeChain
  target?: Target
  status: CheckoutOperationStatus
}

export type OperationEventMap = {
  [OperationEventBusEvents.Initiated]: OperationEventPayload
  [OperationEventBusEvents.StatusChanged]: OperationEventPayload
}

export interface OperationSubscriber {
  onInitiated(cb: (e: OperationEventPayload) => void): void
  onStatusChanged(cb: (e: OperationEventPayload) => void): void
  clearHandlers(): void
}

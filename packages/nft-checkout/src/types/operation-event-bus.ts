import type { BridgeChain } from '@rarimo/shared'

import { OperationEventBusEvents } from '@/enums'

import type { CheckoutOperationParams } from './operation'
import type { CheckoutOperationStatus } from './operation'

export type OperationEventPayload = {
  isInitiated: boolean
  chainFrom?: BridgeChain
  params?: CheckoutOperationParams
  status: CheckoutOperationStatus
}

export type OperationEventMap = {
  [OperationEventBusEvents.Initiated]: OperationEventPayload
  [OperationEventBusEvents.StatusChanged]: OperationEventPayload
}

export type OperationEventCallback = (e?: OperationEventPayload) => void

export interface OperationEmitter {
  emit: (event: OperationEventBusEvents, e: OperationEventPayload) => void
}

export interface OperationSubscriber {
  onInitiated(cb: OperationEventCallback): void
  onStatusChanged(cb: OperationEventCallback): void
  clearHandlers(): void
}

export type OperationEventBus = OperationEmitter & OperationSubscriber

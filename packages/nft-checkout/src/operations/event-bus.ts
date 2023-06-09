import { EventEmitter } from '@distributedlab/tools'

import { OperationEventBusEvents } from '@/enums'
import type {
  OperationEventBus,
  OperationEventCallback,
  OperationEventMap,
  OperationEventPayload,
} from '@/types'

export const createOperationEventBus = (): OperationEventBus => {
  const emitter = new EventEmitter<OperationEventMap>()

  const emit = (
    event: OperationEventBusEvents,
    e: OperationEventPayload,
  ): void => {
    emitter.emit(event, e)
  }

  const onInitiated = (cb: OperationEventCallback): void => {
    emitter.once(OperationEventBusEvents.Initiated, cb)
  }

  const onStatusChanged = (cb: OperationEventCallback): void => {
    emitter.on(OperationEventBusEvents.StatusChanged, cb)
  }

  const clearHandlers = (): void => {
    emitter.clear()
  }

  return {
    emit,
    onInitiated,
    onStatusChanged,
    clearHandlers,
  }
}

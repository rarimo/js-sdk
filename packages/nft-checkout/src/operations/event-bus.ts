import { EventEmitter } from '@distributedlab/tools'

import { OperationEventBusEvents } from '@/enums'
import type { OperationEventMap, OperationEventPayload } from '@/types'

export class OperationEventBus {
  readonly #emitter = new EventEmitter<OperationEventMap>()

  public get emitter(): EventEmitter<OperationEventMap> {
    return this.#emitter
  }

  public emit(event: OperationEventBusEvents, e: OperationEventPayload): void {
    this.#emitter.emit(event, e)
  }

  public onInitiated(cb: (e?: OperationEventPayload) => void): void {
    this.#emitter.once(OperationEventBusEvents.Initiated, cb)
  }

  public onStatusChanged(cb: (e?: OperationEventPayload) => void): void {
    this.#emitter.on(OperationEventBusEvents.StatusChanged, cb)
  }

  public clearHandlers(): void {
    this.#emitter.clear()
  }
}

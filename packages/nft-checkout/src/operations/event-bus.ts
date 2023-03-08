import { EventEmitter } from '@distributedlab/tools'

import { OperationEventBusEvents } from '@/enums'
import { OperationEventMap, OperationInitiatedEventPayload } from '@/types'

export class OperationEventBus {
  readonly #emitter = new EventEmitter<OperationEventMap>()

  public get emitter(): EventEmitter<OperationEventMap> {
    return this.#emitter
  }

  public emitInitiated(e: OperationInitiatedEventPayload): void {
    this.#emitter.emit(OperationEventBusEvents.Initiated, e)
  }

  public onInitiated(cb: (e: OperationInitiatedEventPayload) => void): void {
    this.#emitter.once(OperationEventBusEvents.Initiated, cb)
  }

  public clearHandlers(): void {
    this.#emitter.clear()
  }
}

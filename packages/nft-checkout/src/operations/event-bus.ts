import { EventEmitter } from '@distributedlab/utils'
import {
  OperationEventMap,
  OperationInitiatedEventPayload,
} from '../types/operation-event-bus'
import { OperationEventBusEvents } from '../enums'

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

import { EventEmitter } from '@distributedlab/tools'

import { ProviderEventBusEvents } from '@/enums'
import type {
  ProviderEventCallback,
  ProviderEventMap,
  ProviderEventPayload,
} from '@/types'

export class ProviderEventBus {
  readonly #emitter = new EventEmitter<ProviderEventMap>()

  public get emitter(): EventEmitter<ProviderEventMap> {
    return this.#emitter
  }

  public emit(
    event: ProviderEventBusEvents,
    payload: ProviderEventPayload,
  ): void {
    this.#emitter.emit(event, payload)
  }

  public onInitiated(cb: ProviderEventCallback): void {
    this.#emitter.once(ProviderEventBusEvents.Initiated, cb)
  }

  public onConnect(cb: ProviderEventCallback): void {
    this.#emitter.on(ProviderEventBusEvents.Connect, cb)
  }

  public onDisconnect(cb: ProviderEventCallback): void {
    this.#emitter.on(ProviderEventBusEvents.Disconnect, cb)
  }

  public onAccountChanged(cb: ProviderEventCallback): void {
    this.#emitter.on(ProviderEventBusEvents.AccountChanged, cb)
  }

  public onChainChanged(cb: ProviderEventCallback): void {
    this.#emitter.on(ProviderEventBusEvents.ChainChanged, cb)
  }

  public clearHandlers(): void {
    this.#emitter.clear()
  }
}

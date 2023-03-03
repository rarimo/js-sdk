import { EventEmitter } from '@distributedlab/utils'

import { ProviderEventBusEvents } from '@/enums'
import {
  ProviderChainChangedEventPayload,
  ProviderConnectRelatedEventPayload,
  ProviderEventMap,
  ProviderInitiatedEventPayload,
} from '@/types'

export class ProviderEventBus {
  readonly #emitter = new EventEmitter<ProviderEventMap>()

  public get emitter(): EventEmitter<ProviderEventMap> {
    return this.#emitter
  }

  public emitInitiated(e: ProviderInitiatedEventPayload): void {
    this.#emitter.emit(ProviderEventBusEvents.Initiated, e)
  }

  public emitConnect(e: ProviderConnectRelatedEventPayload): void {
    this.#emitter.emit(ProviderEventBusEvents.Connect, e)
  }

  public emitDisconnect(e: ProviderConnectRelatedEventPayload): void {
    this.#emitter.emit(ProviderEventBusEvents.Disconnect, e)
  }

  public emitAccountChanged(e: ProviderConnectRelatedEventPayload): void {
    this.#emitter.emit(ProviderEventBusEvents.AccountChanged, e)
  }

  public emitChainChanged(e: ProviderChainChangedEventPayload): void {
    this.#emitter.emit(ProviderEventBusEvents.ChainChanged, e)
  }

  public onInitiated(cb: (e: ProviderInitiatedEventPayload) => void): void {
    this.#emitter.once(ProviderEventBusEvents.Initiated, cb)
  }

  public onConnect(cb: (e: ProviderConnectRelatedEventPayload) => void): void {
    this.#emitter.on(ProviderEventBusEvents.Connect, cb)
  }

  public onDisconnect(
    cb: (e: ProviderConnectRelatedEventPayload) => void,
  ): void {
    this.#emitter.on(ProviderEventBusEvents.Disconnect, cb)
  }

  public onAccountChanged(
    cb: (e: ProviderConnectRelatedEventPayload) => void,
  ): void {
    this.#emitter.on(ProviderEventBusEvents.AccountChanged, cb)
  }

  public onChainChanged(
    cb: (e: ProviderChainChangedEventPayload) => void,
  ): void {
    this.#emitter.on(ProviderEventBusEvents.ChainChanged, cb)
  }

  public clearHandlers(): void {
    this.#emitter.clear()
  }
}

import { ProviderEventBusEvents } from '@/enums'

import type { ChainId } from './chain'

export type ProviderEventPayload = {
  address?: string
  chainId?: ChainId
  isConnected: boolean
}

export type ProviderEventMap = {
  [ProviderEventBusEvents.Connect]: ProviderEventPayload
  [ProviderEventBusEvents.Disconnect]: ProviderEventPayload
  [ProviderEventBusEvents.AccountChanged]: ProviderEventPayload
  [ProviderEventBusEvents.ChainChanged]: ProviderEventPayload
  [ProviderEventBusEvents.Initiated]: ProviderEventPayload
}

export type ProviderEventCallback = (e: ProviderEventPayload) => void

export interface ProviderSubscriber {
  onInitiated(cb: ProviderEventCallback): void
  onConnect(cb: ProviderEventCallback): void
  onDisconnect(cb: ProviderEventCallback): void
  onAccountChanged(cb: ProviderEventCallback): void
  onChainChanged?(cb: ProviderEventCallback): void
  clearHandlers(): void
}

export type ProviderListeners = {
  [key in keyof Omit<
    ProviderSubscriber,
    'clearHandlers'
  >]?: ProviderEventCallback
}

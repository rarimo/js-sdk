import { ProviderEventBusEvents } from '../enums'
import { ChainId } from './chain'

export type ProviderConnectRelatedEventPayload = {
  address?: string
  isConnected: boolean
}

export type ProviderChainChangedEventPayload = { chainId?: ChainId }

export type ProviderInitiatedEventPayload = ProviderConnectRelatedEventPayload &
  ProviderChainChangedEventPayload

export type ProviderEventMap = {
  [ProviderEventBusEvents.Connect]: ProviderConnectRelatedEventPayload
  [ProviderEventBusEvents.Disconnect]: ProviderConnectRelatedEventPayload
  [ProviderEventBusEvents.AccountChanged]: ProviderConnectRelatedEventPayload
  [ProviderEventBusEvents.ChainChanged]: ProviderChainChangedEventPayload
  [ProviderEventBusEvents.Initiated]: ProviderInitiatedEventPayload
}

export interface ProviderSubscriber {
  onInitiated(cb: (e: ProviderInitiatedEventPayload) => void): void
  onConnect(cb: (e: ProviderConnectRelatedEventPayload) => void): void
  onDisconnect(cb: (e: ProviderConnectRelatedEventPayload) => void): void
  onAccountChanged(cb: (e: ProviderConnectRelatedEventPayload) => void): void
  onChainChanged?(cb: (e: ProviderChainChangedEventPayload) => void): void
  clearHandlers(): void
}

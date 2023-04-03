import {
  Chain,
  ChainId,
  ChainTypes,
  createProvider,
  CreateProviderOpts,
  EthereumProvider,
  EthTransactionResponse,
  IProvider,
  NearProviderType,
  NearTransactionResponse,
  NearTxRequestBody,
  ProviderChainChangedEventPayload,
  ProviderConnectRelatedEventPayload,
  ProviderInitiatedEventPayload,
  ProviderInstance,
  ProviderProxy,
  ProviderProxyConstructor,
  Providers,
  ProvidersReturnType,
  RawProvider,
  SolanaProvider,
  SolanaTransactionResponse,
  TransactionResponse,
  TxRequestBody,
  Web3,
} from '@rarimo/provider'
import { useCallback, useEffect, useState } from 'react'

const PROVIDER_EVENTS: Array<keyof IProvider> = [
  'onInitiated',
  'onConnect',
  'onAccountChanged',
  'onChainChanged',
  'onDisconnect',
]

type ProviderEventPayload =
  | ProviderConnectRelatedEventPayload
  | ProviderChainChangedEventPayload
  | ProviderInitiatedEventPayload

type ProviderType = {
  provider: IProvider | null
  address?: string
  isConnected?: boolean
  chainId?: ChainId
  chainType?: ChainTypes
  providerType?: Providers
  connect: () => Promise<void>
  addChain: (chain: Chain) => Promise<void>
  switchChain: (chainId: ChainId) => Promise<void>
  signMessage: (message: string) => Promise<string | undefined>
  signAndSendTx: (
    txRequestBody: TxRequestBody,
  ) => Promise<TransactionResponse | undefined>
  getTxUrl: (chain: Chain, txHash: string) => string | undefined
  getHashFromTx: (txResponse: TransactionResponse) => string | undefined
  getAddressUrl: (chain: Chain, address: string) => string | undefined
}
/**
 * @description A React hook that creates a provider object with access to the user's wallet
 *
 * @example
 * ```ts
 * const { provider, ...rest } = useProvider(MetamaskProvider)
 * provider?.connect()
 * console.log(provider?.address)
 * ```
 *
 * @param providerProxy The type of provider from the @rarimo/provider package, such as {@link @rarimo/provider!MetamaskProvider}
 * @param createProviderOpts Options for the connection
 */
export const useProvider = (
  providerProxy: ProviderProxyConstructor,
  createProviderOpts?: CreateProviderOpts,
): ProviderType => {
  const [provider, setProvider] = useState<IProvider | null>(null)
  const [providerReactiveState, setProviderReactiveState] = useState(() => {
    return {
      address: provider?.address,
      isConnected: provider?.isConnected,
      chainId: provider?.chainId,
      chainType: provider?.chainType,
      providerType: provider?.providerType,
    }
  })
  const connect = async (): Promise<void> => await provider?.connect()

  const addChain = async (chain: Chain): Promise<void> =>
    await provider?.addChain?.(chain)

  const switchChain = async (chainId: ChainId): Promise<void> =>
    await provider?.switchChain(chainId)

  const signAndSendTx = async (
    txRequestBody: TxRequestBody,
  ): Promise<TransactionResponse | undefined> =>
    await provider?.signAndSendTx?.(txRequestBody)

  const signMessage = async (message: string): Promise<string | undefined> =>
    await provider?.signMessage?.(message)

  const getHashFromTx = (txResponse: TransactionResponse): string | undefined =>
    provider?.getHashFromTx?.(txResponse)

  const getTxUrl = (chain: Chain, txHash: string): string | undefined =>
    provider?.getTxUrl?.(chain, txHash)

  const getAddressUrl = (chain: Chain, address: string): string | undefined =>
    provider?.getAddressUrl?.(chain, address)

  const setListeners = useCallback(() => {
    if (!provider) return
    PROVIDER_EVENTS.forEach(event => {
      const providerEvent = provider[event] as (
        cb: (payload: ProviderEventPayload) => void,
      ) => void

      providerEvent?.call(provider, payload => {
        setProviderReactiveState(prev => ({
          ...prev,
          ...payload,
        }))
      })
    })
  }, [provider])

  useEffect(() => {
    const initProvider = async () => {
      const initedProvider = await createProvider(
        providerProxy,
        createProviderOpts,
      )
      setProvider(initedProvider)
    }

    initProvider()
  }, [providerProxy, createProviderOpts])

  useEffect(() => {
    provider?.clearHandlers()
    setListeners()
    setProviderReactiveState(prev => ({
      ...prev,
      address: provider?.address,
      isConnected: provider?.isConnected,
      chainId: provider?.chainId,
      chainType: provider?.chainType,
      providerType: provider?.providerType,
    }))
    return () => {
      provider?.clearHandlers()
    }
  }, [provider, setListeners])

  return {
    provider,
    ...providerReactiveState,
    connect,
    addChain,
    switchChain,
    signMessage,
    signAndSendTx,
    getTxUrl,
    getHashFromTx,
    getAddressUrl,
  }
}

export type {
  Chain,
  ChainId,
  ChainTypes,
  CreateProviderOpts,
  EthereumProvider,
  EthTransactionResponse,
  IProvider,
  NearProviderType,
  NearTransactionResponse,
  NearTxRequestBody,
  ProviderChainChangedEventPayload,
  ProviderConnectRelatedEventPayload,
  ProviderInitiatedEventPayload,
  ProviderInstance,
  ProviderProxy,
  ProviderProxyConstructor,
  Providers,
  ProvidersReturnType,
  RawProvider,
  SolanaProvider,
  SolanaTransactionResponse,
  TransactionResponse,
  TxRequestBody,
  Web3,
}

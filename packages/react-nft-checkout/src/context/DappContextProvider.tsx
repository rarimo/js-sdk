import {
  BridgeChain,
  CreateCheckoutOperationParams,
  EstimatedPrice,
  INFTCheckoutOperation,
  PaymentToken,
  Target,
} from '@rarimo/nft-checkout'
import {
  CreateProviderOpts,
  IProvider,
  ProviderProxyConstructor,
} from '@rarimo/provider'
import { createContext, ReactNode, useEffect, useMemo, useState } from 'react'

import { useCheckoutOperation, useProvider } from '@/hooks'

export type DappContextType = {
  setSelectedProviderProxy: React.Dispatch<
    React.SetStateAction<ProviderProxyConstructor | undefined>
  >
  provider: IProvider | null
  createProviderError: string
  checkoutOperation: INFTCheckoutOperation | null
  supportedChains: BridgeChain[]
  selectedChain?: BridgeChain
  setSelectedChain: React.Dispatch<
    React.SetStateAction<BridgeChain | undefined>
  >
  targetNft?: Target
  checkoutTxBundle?: string
  isInitialized: boolean
  loadPaymentTokens?: INFTCheckoutOperation['loadPaymentTokens']
  estimatePrice?: INFTCheckoutOperation['estimatePrice']
  estimatedPrice?: EstimatedPrice
  checkout?: INFTCheckoutOperation['checkout']
  selectedPaymentToken?: PaymentToken
  setSelectedPaymentToken: React.Dispatch<
    React.SetStateAction<PaymentToken | undefined>
  >
}

export type DappContextProviderPropsType = {
  children: ReactNode
  targetNft?: Target
  checkoutTxBundle?: string
  createProviderOpts?: CreateProviderOpts
  createCheckoutOperationParams?: CreateCheckoutOperationParams
}

export const DappContext = createContext({} as DappContextType)

export const DappContextProvider = ({
  children,
  targetNft,
  checkoutTxBundle,
  createProviderOpts,
  createCheckoutOperationParams,
}: DappContextProviderPropsType) => {
  const [supportedChains, setSupportedChains] = useState<BridgeChain[]>([])
  const [selectedChain, setSelectedChain] = useState<BridgeChain | undefined>()

  const [selectedPaymentToken, setSelectedPaymentToken] =
    useState<PaymentToken>()

  const [selectedProviderProxy, setSelectedProviderProxy] = useState<
    ProviderProxyConstructor | undefined
  >()

  const { provider, providerReactiveState, createProviderError } = useProvider(
    selectedProviderProxy,
    createProviderOpts,
  )

  const { checkoutOperation, checkoutOperationReactiveState } =
    useCheckoutOperation({
      provider,
      createCheckoutOperationParams,
      selectedChain,
      targetNft,
    })

  useEffect(() => {
    if (!checkoutOperation) return

    const getSupportedChains = async () => {
      const chains = await checkoutOperation.supportedChains()

      setSupportedChains(chains)
    }

    getSupportedChains()
  }, [checkoutOperation])

  const isInitialized = useMemo(
    () => Boolean(checkoutOperation?.isInitialized),
    [checkoutOperation?.isInitialized],
  )

  const loadPaymentTokens = useMemo(
    () => checkoutOperation?.loadPaymentTokens.bind(checkoutOperation),
    [checkoutOperation],
  )

  const estimatePrice = useMemo(
    () => checkoutOperation?.estimatePrice.bind(checkoutOperation),
    [checkoutOperation],
  )

  const checkout = useMemo(
    () => checkoutOperation?.checkout.bind(checkoutOperation),
    [checkoutOperation],
  )

  const memoizedContextValue = useMemo(() => {
    const ctx: DappContextType = {
      isInitialized,
      setSelectedProviderProxy,
      provider,
      createProviderError,
      checkoutOperation,
      supportedChains,
      selectedChain,
      setSelectedChain,
      targetNft,
      checkoutTxBundle,
      loadPaymentTokens,
      estimatePrice,
      checkout,
      selectedPaymentToken,
      setSelectedPaymentToken,
    }
    return ctx
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isInitialized,
    provider,
    providerReactiveState,
    createProviderError,
    checkoutOperation,
    checkoutOperationReactiveState,
    supportedChains,
    selectedChain,
    targetNft,
    checkoutTxBundle,
    loadPaymentTokens,
    estimatePrice,
    checkout,
    selectedPaymentToken,
  ])

  return (
    <DappContext.Provider value={memoizedContextValue}>
      {children}
    </DappContext.Provider>
  )
}

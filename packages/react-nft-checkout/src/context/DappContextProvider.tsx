import type { Token } from '@rarimo/bridge'
import { tokenFromChain } from '@rarimo/bridge'
import type {
  CheckoutOperation,
  CheckoutOperationParams,
  PaymentToken,
  SwapEstimation,
} from '@rarimo/nft-checkout'
import type {
  CreateProviderOpts,
  IProvider,
  ProviderProxyConstructor,
} from '@rarimo/provider'
import type { BridgeChain } from '@rarimo/shared'
import type { ReactNode } from 'react'
import { createContext, useEffect, useMemo, useState } from 'react'

import { useCheckoutOperation, useProvider } from '@/hooks'

export type DappContextType = {
  params?: CheckoutOperationParams
  createCheckoutTransactionBundleCb?: (caller: string) => string
  isInitialized: boolean
  provider: IProvider | null
  setSelectedProviderProxy: React.Dispatch<
    React.SetStateAction<ProviderProxyConstructor | undefined>
  >
  createProviderError: string
  checkoutOperation: CheckoutOperation | null
  supportedChains: BridgeChain[]
  selectedChain?: BridgeChain
  setSelectedChain: React.Dispatch<
    React.SetStateAction<BridgeChain | undefined>
  >
  selectedSwapToken?: Token
  selectedPaymentToken?: PaymentToken | null
  setSelectedPaymentToken: React.Dispatch<
    React.SetStateAction<PaymentToken | undefined | null>
  >
  estimatedPrice?: SwapEstimation
  setEstimatedPrice: React.Dispatch<
    React.SetStateAction<SwapEstimation | undefined>
  >
  loadPaymentTokens?: CheckoutOperation['getPaymentTokens']
  estimatePrice?: CheckoutOperation['estimatePrice']
  checkout?: CheckoutOperation['checkout']
  getDestinationTx?: CheckoutOperation['getDestinationTx']
}

export type DappContextProviderPropsType = {
  children: ReactNode
  params?: CheckoutOperationParams
  createCheckoutTransactionBundleCb?: (caller: string) => string
  createProviderOpts?: CreateProviderOpts
}

export const DappContext = createContext({} as DappContextType)

/**
 * @description A container for other components such as RarimoPayButton
 * @param children
 * @param params - An object that represents the final NFT transaction
 * @param createCheckoutTransactionBundleCb - A callback which should return encoded bundle of all the transactions to run; see https://rarimo.gitlab.io/docs/docs/overview/bundling
 * @param createProviderOpts - Parameters to pass to the provider; see {@link createProviderOpts}
 */
export const DappContextProvider = ({
  children,
  params,
  createCheckoutTransactionBundleCb,
  createProviderOpts,
}: DappContextProviderPropsType) => {
  const [selectedProviderProxy, setSelectedProviderProxy] =
    useState<ProviderProxyConstructor>()
  const [supportedChains, setSupportedChains] = useState<BridgeChain[]>([])
  const [selectedChain, setSelectedChain] = useState<BridgeChain>()
  const [selectedPaymentToken, setSelectedPaymentToken] =
    useState<PaymentToken | null>()
  const [estimatedPrice, setEstimatedPrice] = useState<SwapEstimation>()

  const { provider, providerReactiveState, createProviderError } = useProvider(
    selectedProviderProxy,
    createProviderOpts,
  )

  const selectedSwapToken = useMemo(() => {
    const chain = supportedChains.find(
      chain => Number(chain.id) === Number(params?.chainIdTo),
    )
    return chain ? tokenFromChain(chain) : undefined
  }, [params?.chainIdTo, supportedChains])

  const { checkoutOperation, checkoutOperationReactiveState } =
    useCheckoutOperation({
      provider,
      selectedChain,
      params,
      selectedSwapToken,
    })

  useEffect(() => {
    if (!checkoutOperation) return

    const getSupportedChains = async () => {
      const chains = await checkoutOperation.getSupportedChains()

      setSupportedChains(chains)
    }

    getSupportedChains()
  }, [checkoutOperation])

  const isInitialized = useMemo(
    () => Boolean(checkoutOperation?.isInitialized),
    [checkoutOperation?.isInitialized],
  )

  const loadPaymentTokens = useMemo(
    () => checkoutOperation?.getPaymentTokens.bind(checkoutOperation),
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

  const getDestinationTx = useMemo(
    () => checkoutOperation?.getDestinationTx.bind(checkoutOperation),
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
      params,
      createCheckoutTransactionBundleCb,
      loadPaymentTokens,
      estimatePrice,
      estimatedPrice,
      setEstimatedPrice,
      checkout,
      getDestinationTx,
      selectedPaymentToken,
      setSelectedPaymentToken,
      selectedSwapToken,
    }
    return ctx
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    checkout,
    checkoutOperation,
    checkoutOperationReactiveState,
    createCheckoutTransactionBundleCb,
    createProviderError,
    estimatePrice,
    estimatedPrice,
    getDestinationTx,
    isInitialized,
    loadPaymentTokens,
    provider,
    providerReactiveState,
    selectedChain,
    selectedPaymentToken,
    selectedSwapToken,
    supportedChains,
    params,
  ])

  return (
    <DappContext.Provider value={memoizedContextValue}>
      {children}
    </DappContext.Provider>
  )
}

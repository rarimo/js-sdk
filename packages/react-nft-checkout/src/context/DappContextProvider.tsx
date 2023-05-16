import type { Token } from '@rarimo/bridge'
import type {
  CreateCheckoutOperationParams,
  EstimatedPrice,
  INFTCheckoutOperation,
  PaymentToken,
  Target,
} from '@rarimo/nft-checkout'
import type {
  CreateProviderOpts,
  IProvider,
  ProviderProxyConstructor,
} from '@rarimo/provider'
import type { BridgeChain } from '@rarimo/shared'
import { createContext, ReactNode, useEffect, useMemo, useState } from 'react'

import { useCheckoutOperation, useProvider } from '@/hooks'

export type DappContextType = {
  targetNft?: Target
  createCheckoutTxBundleCb?: (caller: string) => string
  isInitialized: boolean
  provider: IProvider | null
  setSelectedProviderProxy: React.Dispatch<
    React.SetStateAction<ProviderProxyConstructor | undefined>
  >
  createProviderError: string
  checkoutOperation: INFTCheckoutOperation | null
  supportedChains: BridgeChain[]
  selectedChain?: BridgeChain
  setSelectedChain: React.Dispatch<
    React.SetStateAction<BridgeChain | undefined>
  >
  selectedSwapToken?: Token
  setSelectedSwapToken: React.Dispatch<React.SetStateAction<Token | undefined>>
  selectedPaymentToken?: PaymentToken | null
  setSelectedPaymentToken: React.Dispatch<
    React.SetStateAction<PaymentToken | undefined | null>
  >
  estimatedPrice?: EstimatedPrice
  setEstimatedPrice: React.Dispatch<
    React.SetStateAction<EstimatedPrice | undefined>
  >
  loadPaymentTokens?: INFTCheckoutOperation['loadPaymentTokens']
  getSupportedTokens?: INFTCheckoutOperation['supportedTokens']
  estimatePrice?: INFTCheckoutOperation['estimatePrice']
  checkout?: INFTCheckoutOperation['checkout']
  getDestinationTx?: INFTCheckoutOperation['getDestinationTx']
}

export type DappContextProviderPropsType = {
  children: ReactNode
  targetNft?: Target
  createCheckoutTxBundleCb?: (caller: string) => string
  createProviderOpts?: CreateProviderOpts
  createCheckoutOperationParams?: CreateCheckoutOperationParams
}

export const DappContext = createContext({} as DappContextType)

/**
 * @description A container for other components such as RarimoPayButton
 * @param {Target} props.targetNft An object that represents the final NFT transaction
 * @param props.createCheckoutTxBundleCb A callback which should return encoded bundle of all the transactions to run; see https://rarimo.gitlab.io/docs/docs/overview/bundling
 * @param props.createProviderOpts Parameters to pass to the provider; see {@link createProviderOpts}
 * @param props.createCheckoutOperationParams Parameters to pass to the checkout operation; see {@link createCheckoutOperation}
 */
export const DappContextProvider = ({
  children,
  targetNft,
  createCheckoutTxBundleCb,
  createProviderOpts,
  createCheckoutOperationParams,
}: DappContextProviderPropsType) => {
  const [selectedProviderProxy, setSelectedProviderProxy] =
    useState<ProviderProxyConstructor>()
  const [supportedChains, setSupportedChains] = useState<BridgeChain[]>([])
  const [selectedChain, setSelectedChain] = useState<BridgeChain>()

  const [selectedSwapToken, setSelectedSwapToken] = useState<Token>()
  const [selectedPaymentToken, setSelectedPaymentToken] =
    useState<PaymentToken | null>()
  const [estimatedPrice, setEstimatedPrice] = useState<EstimatedPrice>()

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
      selectedSwapToken,
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

  const getSupportedTokens = useMemo(
    () => checkoutOperation?.supportedTokens.bind(checkoutOperation),
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
      getSupportedTokens,
      provider,
      createProviderError,
      checkoutOperation,
      supportedChains,
      selectedChain,
      setSelectedChain,
      targetNft,
      createCheckoutTxBundleCb,
      loadPaymentTokens,
      estimatePrice,
      estimatedPrice,
      setEstimatedPrice,
      checkout,
      getDestinationTx,
      selectedPaymentToken,
      setSelectedPaymentToken,
      selectedSwapToken,
      setSelectedSwapToken,
    }
    return ctx
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    checkout,
    checkoutOperation,
    checkoutOperationReactiveState,
    createCheckoutTxBundleCb,
    createProviderError,
    estimatePrice,
    estimatedPrice,
    getDestinationTx,
    getSupportedTokens,
    isInitialized,
    loadPaymentTokens,
    provider,
    providerReactiveState,
    selectedChain,
    selectedPaymentToken,
    selectedSwapToken,
    supportedChains,
    targetNft,
  ])

  return (
    <DappContext.Provider value={memoizedContextValue}>
      {children}
    </DappContext.Provider>
  )
}

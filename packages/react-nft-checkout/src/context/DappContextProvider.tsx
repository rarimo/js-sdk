import {
  BridgeChain,
  CreateCheckoutOperationParams,
  EstimatedPrice,
  INFTCheckoutOperation,
  PaymentToken,
} from '@rarimo/nft-checkout'
import {
  CreateProviderOpts,
  IProvider,
  MetamaskProvider,
  TransactionResponse,
} from '@rarimo/provider'
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react'

import { buildDemoTxBundle } from '@/helpers/build-demo-tx-bundle'
import { useCheckoutOperation, useProvider } from '@/hooks'

export type CheckoutProps = {
  estimatedPriceProp?: EstimatedPrice
  txBundleProp?: string
}

export type DappContextType = {
  provider: IProvider | null
  checkoutOperation: INFTCheckoutOperation | null
  isInitialized: boolean
  loadPaymentTokens: () => Promise<PaymentToken[]>
  estimatePrice: (
    paymentTokenProp?: PaymentToken,
  ) => Promise<EstimatedPrice | undefined>
  checkout: (
    checkoutProps?: CheckoutProps,
  ) => Promise<TransactionResponse | undefined>
}

export type DappContextProviderPropsType = {
  children: ReactNode
  createProviderOpts?: CreateProviderOpts
  createCheckoutOperationParams?: CreateCheckoutOperationParams
}

const DappContext = createContext({} as DappContextType)

export const DappContextProvider = ({
  children,
  createProviderOpts,
  createCheckoutOperationParams,
}: DappContextProviderPropsType) => {
  const targetNft = useRef({
    chainId: 11155111, // Source chain id (Sepolia in our case)
    address: '0x77fedfb705c8bac2e03aad2ad8a8fe83e3e20fa1', // Contract address
    recipient: '0x8fe0d4923f61ff466430f63471e27b89a7cf0c92', // Recipient wallet address
    price: {
      value: '10000000000000000', // Price amount in UINT (10000000000000000*10^18 = 0.01 ETH)
      decimals: 18, // Price amount decimals
      symbol: 'ETH', // Price token symbol
    },
  }).current

  const selectedChainState = useState<BridgeChain | undefined>()
  const [selectedChain] = selectedChainState

  const [paymentTokens, setPaymentTokens] = useState<PaymentToken[]>([])
  const [estimatedPrice, setEstimatedPrice] = useState<
    EstimatedPrice | undefined
  >()

  const { provider, providerReactiveState } = useProvider(
    MetamaskProvider,
    createProviderOpts,
  )
  const { checkoutOperation, checkoutOperationReactiveState } =
    useCheckoutOperation({
      provider,
      createCheckoutOperationParams,
      selectedChainState,
      targetNft,
    })

  const isInitialized = useMemo(
    () => Boolean(checkoutOperation?.isInitialized),
    [checkoutOperation?.isInitialized],
  )

  const loadPaymentTokens = useCallback(async () => {
    if (!selectedChain) {
      throw new Error('Bridge chain not selected')
    }

    const tokens =
      (await checkoutOperation?.loadPaymentTokens(selectedChain)) || []
    setPaymentTokens(tokens)
    return tokens
  }, [checkoutOperation, selectedChain])

  const estimatePrice = useCallback(
    async (paymentTokenProp?: PaymentToken) => {
      const paymentToken = paymentTokenProp || paymentTokens[0]

      if (!paymentToken) {
        throw new Error('Payment token not selected')
      }

      const price = await checkoutOperation?.estimatePrice(paymentToken)
      setEstimatedPrice(price)
      return price
    },
    [checkoutOperation, paymentTokens],
  )

  const checkout = useCallback(
    async ({ estimatedPriceProp, txBundleProp }: CheckoutProps = {}) => {
      const price = estimatedPriceProp || estimatedPrice

      if (!price) {
        throw new Error('Estimated price not provided')
      }

      const bundle = txBundleProp || buildDemoTxBundle(targetNft)

      const txHash = await checkoutOperation?.checkout(price, {
        bundle,
      })
      return txHash
    },
    [checkoutOperation, estimatedPrice, targetNft],
  )

  const memoizedContextValue = useMemo(() => {
    const ctx: DappContextType = {
      isInitialized,
      provider,
      checkoutOperation,
      loadPaymentTokens,
      estimatePrice,
      checkout,
    }
    return ctx
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isInitialized,
    provider,
    providerReactiveState,
    checkoutOperation,
    checkoutOperationReactiveState,
    loadPaymentTokens,
    estimatePrice,
    checkout,
  ])

  return (
    <DappContext.Provider value={memoizedContextValue}>
      {isInitialized ? <>{children}</> : null}
    </DappContext.Provider>
  )
}

export const useDappContext = (): DappContextType => {
  const context = useContext(DappContext)

  if (typeof context === 'undefined' || Object.values(context).length === 0) {
    throw new Error('useDappContext must be used within an DappContextProvider')
  }
  return context
}

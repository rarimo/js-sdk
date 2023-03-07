import {
  BridgeChain,
  CreateCheckoutOperationParams,
  EstimatedPrice,
  INFTCheckoutOperation,
  PaymentToken,
  Price,
  Target,
} from '@rarimo/nft-checkout'
import {
  CreateProviderOpts,
  IProvider,
  MetamaskProvider,
} from '@rarimo/provider'
import {
  createContext,
  ReactNode,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react'

import { buildDemoTxBundle } from '@/helpers/build-demo-tx-bundle'
import { useCheckoutOperation, useProvider } from '@/hooks'

export type CheckoutProps = {
  price?: EstimatedPrice
  txBundleProp?: string
}

export type DappContextType = {
  provider: IProvider | null
  checkoutOperation: INFTCheckoutOperation | null
  selectedChain?: BridgeChain
  targetNft: Target
  isInitialized: boolean
  loadPaymentTokens?: INFTCheckoutOperation['loadPaymentTokens']
  estimatePrice?: INFTCheckoutOperation['estimatePrice']
  estimatedPrice?: EstimatedPrice
  checkout: (checkoutProps?: CheckoutProps) => Promise<string>
  selectedPaymentToken?: PaymentToken
  setSelectedPaymentToken: React.Dispatch<
    React.SetStateAction<PaymentToken | undefined>
  >
}

export type DappContextProviderPropsType = {
  children: ReactNode
  createProviderOpts?: CreateProviderOpts
  createCheckoutOperationParams?: CreateCheckoutOperationParams
}

export const DappContext = createContext({} as DappContextType)

export const DappContextProvider = ({
  children,
  createProviderOpts,
  createCheckoutOperationParams,
}: DappContextProviderPropsType) => {
  const targetNft = useRef({
    chainId: 11155111, // Source chain id (Sepolia in our case)
    address: '0x77fedfb705c8bac2e03aad2ad8a8fe83e3e20fa1', // Contract address
    recipient: '0x8fe0d4923f61ff466430f63471e27b89a7cf0c92', // Recipient wallet address
    price: Price.fromRaw('0.01', 18, 'ETH'),
    // The token to swap the payment token to
    swapTargetTokenSymbol: 'WETH',
  }).current

  const selectedChainState = useState<BridgeChain | undefined>()
  const [selectedChain] = selectedChainState

  const [selectedPaymentToken, setSelectedPaymentToken] =
    useState<PaymentToken>()

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

  const loadPaymentTokens = useMemo(
    () => checkoutOperation?.loadPaymentTokens.bind(checkoutOperation),
    [checkoutOperation],
  )

  const estimatePrice = useMemo(
    () => checkoutOperation?.estimatePrice.bind(checkoutOperation),
    [checkoutOperation],
  )

  const checkout = useCallback(
    async ({ price, txBundleProp }: CheckoutProps = {}) => {
      if (!price) {
        throw new Error('Estimated price not provided')
      }

      const bundle = txBundleProp || buildDemoTxBundle(targetNft)

      const txHash = await checkoutOperation?.checkout(price, {
        bundle,
      })
      return txHash ? String(txHash) : ''
    },
    [checkoutOperation, targetNft],
  )

  const memoizedContextValue = useMemo(() => {
    const ctx: DappContextType = {
      isInitialized,
      provider,
      checkoutOperation,
      selectedChain,
      targetNft,
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
    checkoutOperation,
    checkoutOperationReactiveState,
    selectedChain,
    targetNft,
    loadPaymentTokens,
    estimatePrice,
    checkout,
    selectedPaymentToken,
  ])

  return (
    <DappContext.Provider value={memoizedContextValue}>
      {isInitialized ? <>{children}</> : null}
    </DappContext.Provider>
  )
}

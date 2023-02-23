import {
  CreateCheckoutOperationParams,
  INFTCheckoutOperation,
} from '@rarimo/nft-checkout'
import {
  CreateProviderOpts,
  MetamaskProvider,
  Provider,
} from '@rarimo/provider'
import {
  createContext,
  ReactNode,
  useContext,
  // useEffect,
  useMemo,
  useState,
} from 'react'

import { useCheckoutOperation, useProvider } from '..'

export interface DappContextPropsType {
  provider: Provider | null
  checkoutOperation: INFTCheckoutOperation | null
  isInitialized: boolean
}

export interface DappContextProviderPropsType {
  children: ReactNode
  createProviderOpts?: CreateProviderOpts
  createCheckoutOperationParams?: CreateCheckoutOperationParams
}

const DappContext = createContext({} as DappContextPropsType)

export const DappContextProvider = ({
  children,
  createProviderOpts,
  createCheckoutOperationParams,
}: DappContextProviderPropsType) => {
  const [isInitialized] = useState(false)

  const provider = useProvider(MetamaskProvider, createProviderOpts)
  const checkoutOperation = useCheckoutOperation(
    provider,
    createCheckoutOperationParams,
  )

  console.log('provider', checkoutOperation?.initialized)

  // useEffect(() => {
  //   console.log('useEffect', checkoutOperation?.initialized)
  // }, [
  //   checkoutOperation?.chain,
  //   checkoutOperation?.initialized,
  //   checkoutOperation?.provider,
  // ])

  const memoizedContextValue = useMemo(
    () => ({
      isInitialized,
      provider,
      checkoutOperation,
    }),
    [isInitialized, checkoutOperation, provider],
  )

  return (
    <DappContext.Provider value={memoizedContextValue}>
      {isInitialized ? <>{children}</> : null}
    </DappContext.Provider>
  )
}

export const useDappContext = (): DappContextPropsType => {
  const context = useContext(DappContext)

  if (typeof context === 'undefined' || Object.values(context).length === 0) {
    throw new Error('useDappContext must be used within an DappContextProvider')
  }
  return context
}

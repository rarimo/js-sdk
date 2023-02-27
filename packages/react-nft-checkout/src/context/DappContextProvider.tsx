import {
  CreateCheckoutOperationParams,
  INFTCheckoutOperation,
} from '@rarimo/nft-checkout'
import {
  CreateProviderOpts,
  IProvider,
  MetamaskProvider,
} from '@rarimo/provider'
import { createContext, ReactNode, useContext, useMemo, useState } from 'react'

import { useCheckoutOperation, useProvider } from '@/hooks'

export interface DappContextPropsType {
  provider: IProvider | null
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

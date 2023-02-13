import {
  createContext,
  FC,
  ReactNode,
  // useCallback,
  useContext,
  // useEffect,
  useMemo,
  useState,
} from 'react'

// import { PROVIDERS } from '@/enums'
// import { useProvider, useWeb3 } from '@/hooks'
// import { DesignatedProvider } from '@/types'

export interface DappContextPropsType {
  // web3Providers: DesignatedProvider[]
  qwe: string
}

export interface DappContextProviderPropsType {
  children: ReactNode
}

const DappContext = createContext({} as DappContextPropsType)

export const DappContextProvider: FC<DappContextProviderPropsType> = ({
  children,
}) => {
  // const [isInitialized, setIsInitialized] = useState(false)
  const [isInitialized] = useState(true)

  // const web3 = useWeb3()

  // const [web3Providers, setWeb3Providers] = useState<DesignatedProvider[]>([])

  // const metamaskProvider = useProvider()
  // const coinbaseProvider = useProvider()
  // const phantomProvider = useProvider()
  // const solflareProvider = useProvider()
  // const nearProvider = useProvider()

  // const providers = useMemo(
  //   () => [
  //     metamaskProvider,
  //     coinbaseProvider,
  //     phantomProvider,
  //     solflareProvider,
  //     nearProvider,
  //   ],
  //   [
  //     coinbaseProvider,
  //     metamaskProvider,
  //     phantomProvider,
  //     solflareProvider,
  //     nearProvider,
  //   ],
  // )

  // const initWeb3Providers = useCallback(async () => {
  //   await web3.init()
  // }, [web3])

  // const initProviderWrappers = useCallback(async () => {
  //   if (!web3Providers.length) return

  //   const metamaskBrowserProvider = web3Providers.find(
  //     el => el.name === PROVIDERS.metamask,
  //   )

  //   const coinbaseBrowserProvider = web3Providers.find(
  //     el => el.name === PROVIDERS.coinbase,
  //   )

  //   const phantomBrowserProvider = web3Providers.find(
  //     el => el.name === PROVIDERS.phantom,
  //   )

  //   const solflareBrowserProvider = web3Providers.find(
  //     el => el.name === PROVIDERS.solflare,
  //   )

  //   const nearBrowserProvider = web3Providers.find(
  //     el => el.name === PROVIDERS.near,
  //   )

  //   await Promise.all([
  //     ...(metamaskBrowserProvider
  //       ? [metamaskProvider.init(metamaskBrowserProvider)]
  //       : []),
  //     ...(coinbaseBrowserProvider
  //       ? [coinbaseProvider.init(coinbaseBrowserProvider)]
  //       : []),
  //     ...(phantomBrowserProvider
  //       ? [phantomProvider.init(phantomBrowserProvider)]
  //       : []),
  //     ...(solflareBrowserProvider
  //       ? [solflareProvider.init(solflareBrowserProvider)]
  //       : []),
  //     ...(nearBrowserProvider ? [nearProvider.init(nearBrowserProvider)] : []),
  //   ])
  //   setIsInitialized(true)
  // }, [
  //   coinbaseProvider,
  //   metamaskProvider,
  //   phantomProvider,
  //   solflareProvider,
  //   nearProvider,
  //   web3Providers,
  // ])

  // useEffect(() => {
  //   initWeb3Providers()
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])

  // useEffect(() => {
  //   setWeb3Providers(web3.providers)
  // }, [web3.providers])

  // useEffect(() => {
  //   if (providers.find(el => Boolean(el.selectedProvider))?.selectedProvider)
  //     return

  //   initProviderWrappers()
  // }, [
  //   initProviderWrappers,
  //   metamaskProvider.selectedProvider,
  //   providers,
  //   web3Providers,
  // ])

  const memoizedContextValue = useMemo(
    () => ({
      // web3Providers,
      qwe: 'qwe',
    }),
    [
      // web3Providers
    ],
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

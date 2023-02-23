import { Web3 } from '@rarimo/provider'
import { useEffect, useState } from 'react'

export const useWeb3 = () => {
  const [, setIsInitialized] = useState(false)
  const [web3] = useState(() => new Web3())

  useEffect(() => {
    const initWeb3 = async () => {
      const initedWeb3 = await web3.init()
      setIsInitialized(initedWeb3.isEnabled)
    }

    initWeb3()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return web3
}

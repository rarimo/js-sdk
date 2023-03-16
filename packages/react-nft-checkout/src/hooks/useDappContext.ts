import { useContext } from 'react'

import { DappContext } from '@/context'

export const useDappContext = () => {
  const context = useContext(DappContext)

  if (Object.values(context || {}).length === 0) {
    throw new Error('useDappContext must be used within an DappContextProvider')
  }
  return context
}

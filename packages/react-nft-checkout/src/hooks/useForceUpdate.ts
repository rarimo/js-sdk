import { useCallback, useState } from 'react'

export const useForceUpdate = () => {
  const [, setValue] = useState(0)
  const forceUpdate = useCallback(() => setValue(prev => prev + 1), [])
  return forceUpdate
}

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { App } from '@/App'
import { DappContextProvider } from '@/context/DappContextProvider'

const root = createRoot(document.getElementById('root') as Element)

root.render(
  <StrictMode>
    <DappContextProvider>
      <App />
    </DappContextProvider>
  </StrictMode>,
)

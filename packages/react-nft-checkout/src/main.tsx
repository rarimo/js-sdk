// eslint-disable-next-line import/no-unresolved
import 'https://unpkg.com/web3@latest/dist/web3.min.js'

// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { App } from '@/App'
import { DappContextProvider } from '@/context/DappContextProvider'

const root = createRoot(document.getElementById('root') as Element)

root.render(
  // <StrictMode>
  <DappContextProvider>
    <App />
  </DappContextProvider>,
  // </StrictMode>,
)

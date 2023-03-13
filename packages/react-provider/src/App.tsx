import { MetamaskProvider } from '@rarimo/provider'

import { useProvider } from './hooks'

function App() {
  const { provider, ...rest } = useProvider(MetamaskProvider)

  // eslint-disable-next-line no-console
  console.log({ provider, ...rest })

  return <div className="App">React Provider</div>
}

export default App

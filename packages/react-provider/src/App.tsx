import { MetamaskProvider } from '@rarimo/provider'

import { useProvider } from './hooks'

function App() {
  const { provider, ...rest } = useProvider(MetamaskProvider)

  console.log({ provider, ...rest })

  return <div className="App">React Provider</div>
}

export default App

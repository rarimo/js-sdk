import { useProvider } from './hooks'
import { MetamaskProvider } from '@rarimo/provider'

function App() {
  const { provider, providerReactiveState } = useProvider(MetamaskProvider)

  console.log({ provider, providerReactiveState })

  return <div className="App">React Provider</div>
}

export default App

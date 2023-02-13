import { useDappContext } from '@/context'

export const App = () => {
  const ctx = useDappContext()
  // eslint-disable-next-line no-console
  console.log(ctx)
  return <div className="app"></div>
}

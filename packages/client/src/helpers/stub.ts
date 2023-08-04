// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const stub = (msg: string): any => {
  return new Proxy(
    {},
    {
      get() {
        throw new ReferenceError(msg)
      },
    },
  )
}

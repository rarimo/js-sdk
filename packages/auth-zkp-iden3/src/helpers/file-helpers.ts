import { Fetcher } from '@distributedlab/fetcher'

const fetcher = new Fetcher({
  baseUrl: 'https://raw.githubusercontent.com',
  credentials: 'omit',
})

export async function readBytesFile(path: string) {
  const response = await fetcher.get(path)
  console.log(response)
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return new Uint8Array(await response?.data?.arrayBuffer?.())
}

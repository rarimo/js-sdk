import { fetcher } from '@distributedlab/fetcher'

export async function readBytesFile(path: string) {
  const response = await fetcher.get(path)
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return new Uint8Array(await response?.data?.arrayBuffer?.())
}

import { fetcher, type FetcherStandaloneConfig } from '@distributedlab/fetcher'

import { errors } from '@/errors'

export async function getBytesFile(
  path: string,
  opts?: FetcherStandaloneConfig,
) {
  const { data } = await fetcher.get<Blob>(path, {}, opts)

  if (!data) throw new errors.FileEmptyError(`File by ${path} is empty`)

  return new Uint8Array(await data!.arrayBuffer())
}

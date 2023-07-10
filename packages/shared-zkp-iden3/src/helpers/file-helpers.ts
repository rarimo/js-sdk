import { fetcher } from '@distributedlab/fetcher'

import { errors } from '@/errors'

export async function getBytesFile(path: string) {
  const { data } = await fetcher.get<Blob>(path)

  if (!data) throw new errors.FileEmptyError(`File by ${path} is empty`)

  return new Uint8Array(await data!.arrayBuffer())
}

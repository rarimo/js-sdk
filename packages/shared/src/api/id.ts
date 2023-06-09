import type { InternalTokenId } from '@/types'

const parseID = <T extends [string | number, string]>(id: string): T => {
  return id.split(':') as T
}

export const parseTokenId = (id: string): InternalTokenId => {
  return parseID<InternalTokenId>(id)
}

import type { InternalTokenId } from '@/types'

export const parseTokenId = (id: string): InternalTokenId => {
  return id.split(':') as InternalTokenId
}

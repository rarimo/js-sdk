import { isFunction } from '@/helpers'

import type { Computed } from './computed'
import { isComputed } from './computed'
import type { Ref } from './ref'
import { isRef } from './ref'

export type ComputedOrRef<T = unknown> = Ref<T> | Computed<T>
export type Unwrap<T> = T extends ComputedOrRef<infer V> ? V : T
export type Raw<T> = {
  [K in keyof T]: Unwrap<T[K]>
}

export const toRaw = <T extends object>(target: T): Raw<T> => {
  const obj = {} as Raw<T>

  const descriptors = Object.entries(target).reduce<
    PropertyDescriptorMap & ThisType<T>
  >((acc, [k, v]) => {
    let result: PropertyDescriptor = {
      get: () => (isRef(v) || isComputed(v) ? v.value : v),
      enumerable: true,
    }

    if (isFunction(v)) {
      result = { value: v }
    }

    acc[k] = result
    return acc
  }, {})

  Object.defineProperties(obj, descriptors)

  return obj
}

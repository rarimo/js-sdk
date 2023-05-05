import { isFunction } from '@/helpers'

import { Computed, isComputed } from './computed'
import { isRef, Ref } from './ref'

export type ComputedOrRef<T = unknown> = Ref<T> | Computed<T>

export type Raw<T extends object> = {
  readonly [K in keyof T]: T[K] extends ComputedOrRef
    ? ComputedOrRef<T[K]['value']>['value']
    : T[K]
}

export const toRaw = <T extends object>(target: T): Raw<T> => {
  const obj = {}

  const descriptors = Object.entries(target).reduce<
    PropertyDescriptorMap & ThisType<T>
  >((acc, [k, v]) => {
    let result: PropertyDescriptor = {
      get: () => (isRef(v) || isComputed(v) ? v.value : v),
    }

    if (isFunction(v)) {
      result = { value: v }
    }

    acc[k] = result
    return acc
  }, {})

  Object.defineProperties(obj, descriptors)

  return obj as Raw<T>
}

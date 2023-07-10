export const hasOwn = (
  val: object,
  key: string | symbol,
): key is keyof typeof val => {
  return Object.prototype.hasOwnProperty.call(val, key)
}

export const isArray = <T = unknown>(val: unknown): val is T[] => {
  return Array.isArray(val)
}

export const isOneElementArray = <T = unknown>(val: unknown): val is T[] => {
  return isArray(val) && val.length === 1
}

// eslint-disable-next-line @typescript-eslint/ban-types
export const isFunction = (val: unknown): val is Function => {
  return typeof val === 'function'
}

export const isString = (val: unknown): val is string => {
  return typeof val === 'string'
}

export const isObject = (
  val: unknown,
): val is Record<string | number | symbol, unknown> => {
  return val !== null && typeof val === 'object'
}

export const isPlainObject = (val: unknown): val is object => {
  return Object.prototype.toString.call(val) === '[object Object]'
}

export const isUndefined = (val: unknown): val is undefined => {
  return typeof val === 'undefined'
}

export const toLowerCase = (val?: string): string => {
  return val?.toLowerCase() ?? ''
}

export const omit = <T extends object, K extends keyof T>(
  obj: T,
  keys: Array<K | ReadonlyArray<K>>,
): Omit<T, K> => {
  return Object.entries(obj).reduce((result, [key, value]) => {
    if (!keys.includes(key as K)) {
      result[key as keyof Omit<T, K>] = value
    }
    return result
  }, {} as Omit<T, K>)
}

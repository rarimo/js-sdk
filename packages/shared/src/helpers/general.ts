export const hasOwn = (
  val: object,
  key: string | symbol,
): key is keyof typeof val => {
  return Object.prototype.hasOwnProperty.call(val, key)
}

export const isArray = Array.isArray

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

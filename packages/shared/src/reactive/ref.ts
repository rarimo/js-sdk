import { isComputed, MaybeComputed } from './computed'

export type Ref<T = unknown> = {
  value: T
}

export type MaybeRef<T = unknown> = T | Ref<T>

export class RefIml<T> {
  #value: T

  constructor(value: T) {
    this.#value = unref(value)
  }

  public get value() {
    return this.#value
  }

  public set value(newValue: T) {
    this.#value = newValue
  }
}

export const isRef = <T>(value: MaybeRef<T>): value is Ref<T> => {
  return value instanceof RefIml
}

export const unref = <T>(target: MaybeRef<T> | MaybeComputed<T>): T => {
  return isRef(target) || isComputed(target) ? target.value : target
}

export const ref = <T>(value: T): Ref<T> => new RefIml(value)

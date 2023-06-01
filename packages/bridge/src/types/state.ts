export type State<T = unknown> = {
  __state: true
  value: T
}

export type UnwrapStatesResult<T extends object> = {
  [K in keyof T]: T[K] extends State ? State<T[K]['value']>['value'] : T[K]
}

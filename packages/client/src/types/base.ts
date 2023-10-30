export type BaseModel<T extends string> = {
  '@type': T
}

export type PageResponse<T extends object> = T & {
  pagination: {
    next_key: string
    total: string
  }
}

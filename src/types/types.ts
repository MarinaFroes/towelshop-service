export type ParsedToken = {
  [key: string]: any
}

export type Query = {
  [queryParams: string]: string
}

export type Page<T> = {
  items: T[]
  totalPages: number
}

export type DecodedData = {
  [key: string]: string
}

export type PaginateResult<T> = {
  data: T[]
  total: number
  perPage: number
  page: number
  totalPages: number
}

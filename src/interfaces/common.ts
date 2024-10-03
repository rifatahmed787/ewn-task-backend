
export type IMeta = {
  page: number
  limit: number
  total: number
}

export type GenericResponse<T> = {
  meta?: IMeta
  data: T
}

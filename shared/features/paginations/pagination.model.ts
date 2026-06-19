export interface PaginationOptions {
  limit?: number;
  page?: number;
}

export interface PaginationResult<T> {
  count: number;
  data: T[];
}

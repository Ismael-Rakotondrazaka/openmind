export interface ApiError {
  code: string;
  details: null | Record<string, unknown>;
  message: string;
}

export interface ApiResponse<T = unknown> {
  data: null | T;
  error: ApiError | null;
  meta: ApiResponseMeta;
  success: boolean;
}

export interface ApiResponseMeta {
  pagination: null | PaginationMetadata;
  timestamp: string;
}

export interface PaginationMetadata {
  hasNextPage: boolean;
  hasPrevPage: boolean;
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

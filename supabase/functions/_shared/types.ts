export type ApiResponse<T = unknown> = {
  data?: T;
  error?: {
    code: string;
    details?: Record<string, unknown>;
    message: string;
  };
  meta?: {
    [key: string]: unknown;
    timestamp: string;
  };
  success: boolean;
};

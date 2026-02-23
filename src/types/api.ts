export interface ApiResponse<T> {
  status: number;
  success: boolean;
  payload: T;
  errors: string[];
}

export interface PaginatedPayload<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
}

export type PaginatedResponse<T> = ApiResponse<PaginatedPayload<T>>;

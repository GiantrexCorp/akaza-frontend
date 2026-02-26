export type ApiErrorBag = string[] | Record<string, string[]>;

export interface ApiResponse<T> {
  status: number;
  success: boolean;
  payload: T;
  errors: ApiErrorBag;
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
}

export interface PaginatedPayload<T> {
  data: T[];
  meta: PaginationMeta;
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
}

export type PaginatedResponse<T> = ApiResponse<PaginatedPayload<T>>;

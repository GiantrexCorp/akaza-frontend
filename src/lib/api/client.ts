import type { ApiResponse } from '@/types/api';

export class ApiError extends Error {
  constructor(
    public status: number,
    public errors: string[],
  ) {
    super(errors[0] || 'An error occurred');
  }
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

function getHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const locale = localStorage.getItem('locale') || 'en';
    headers['Accept-Language'] = locale;
  }

  return headers;
}

async function request<T>(method: string, endpoint: string, body?: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: getHeaders(),
    body: body ? JSON.stringify(body) : undefined,
  });

  const json: ApiResponse<T> = await res.json();

  if (!json.success) {
    throw new ApiError(json.status, json.errors);
  }

  return json.payload;
}

export const api = {
  get: <T>(endpoint: string) => request<T>('GET', endpoint),
  post: <T>(endpoint: string, body?: unknown) => request<T>('POST', endpoint, body),
  put: <T>(endpoint: string, body?: unknown) => request<T>('PUT', endpoint, body),
  patch: <T>(endpoint: string, body?: unknown) => request<T>('PATCH', endpoint, body),
  delete: <T>(endpoint: string) => request<T>('DELETE', endpoint),

  async download(endpoint: string): Promise<Blob> {
    const headers = getHeaders() as Record<string, string>;
    delete headers['Content-Type'];

    const res = await fetch(`${BASE_URL}${endpoint}`, { headers });

    if (!res.ok) {
      throw new ApiError(res.status, ['Download failed']);
    }

    return res.blob();
  },
};

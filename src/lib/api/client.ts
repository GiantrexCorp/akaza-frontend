import type { ApiResponse } from '@/types/api';

type FieldErrors = Record<string, string[]>;

function normalizeErrors(errors: unknown): { messages: string[]; fields: FieldErrors } {
  if (Array.isArray(errors)) {
    const messages = errors.filter((value): value is string => typeof value === 'string');
    return { messages, fields: {} };
  }

  if (errors && typeof errors === 'object') {
    const fields: FieldErrors = {};
    const messages: string[] = [];

    for (const [key, value] of Object.entries(errors as Record<string, unknown>)) {
      if (Array.isArray(value)) {
        const arr = value.filter((item): item is string => typeof item === 'string');
        fields[key] = arr;
        messages.push(...arr);
        continue;
      }

      if (typeof value === 'string') {
        fields[key] = [value];
        messages.push(value);
      }
    }

    return { messages, fields };
  }

  if (typeof errors === 'string') {
    return { messages: [errors], fields: {} };
  }

  return { messages: [], fields: {} };
}

export class ApiError extends Error {
  public fieldErrors: FieldErrors;

  constructor(
    public status: number,
    errors: unknown,
    fallbackMessage = 'An error occurred',
  ) {
    const normalized = normalizeErrors(errors);
    super(normalized.messages[0] || fallbackMessage);
    this.errors = normalized.messages;
    this.fieldErrors = normalized.fields;
  }

  public errors: string[];
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

  let json: unknown = null;
  try {
    json = await res.json();
  } catch {
    json = null;
  }

  const envelope = json as Partial<ApiResponse<T>> | null;
  if (envelope && typeof envelope === 'object' && 'success' in envelope) {
    if (envelope.success) {
      return envelope.payload as T;
    }

    throw new ApiError(
      typeof envelope.status === 'number' ? envelope.status : res.status,
      envelope.errors,
    );
  }

  if (!res.ok) {
    const fallbackMessage =
      json && typeof json === 'object' && 'message' in (json as Record<string, unknown>) && typeof (json as Record<string, unknown>).message === 'string'
        ? ((json as Record<string, unknown>).message as string)
        : 'Request failed';
    const errors =
      json && typeof json === 'object' && 'errors' in (json as Record<string, unknown>)
        ? (json as Record<string, unknown>).errors
        : fallbackMessage;
    throw new ApiError(res.status, errors, fallbackMessage);
  }

  return json as T;
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

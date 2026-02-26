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

export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

const REQUEST_TIMEOUT_MS = 30_000;

export function handleUnauthorized(status: number): never {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
    document.cookie = 'logged_in=; path=/; max-age=0';
    window.dispatchEvent(new CustomEvent('auth:unauthorized'));
  }
  throw new ApiError(status, ['Unauthorized']);
}

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

export function getUploadHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
  };
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const locale = localStorage.getItem('locale') || 'en';
    headers['Accept-Language'] = locale;
  }
  return headers;
}

interface RequestOptions {
  signal?: AbortSignal;
}

async function request<T>(
  method: string,
  endpoint: string,
  body?: unknown,
  options?: RequestOptions,
): Promise<T> {
  const externalSignal = options?.signal;
  let internalController: AbortController | undefined;
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  if (!externalSignal) {
    internalController = new AbortController();
    timeoutId = setTimeout(() => internalController!.abort(), REQUEST_TIMEOUT_MS);
  }

  const signal = externalSignal ?? internalController!.signal;

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers: getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
      signal,
    });

    if (res.status === 401) handleUnauthorized(res.status);

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
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      if (internalController) {
        throw new ApiError(0, ['Request timed out']);
      }
      throw err;
    }
    throw err;
  } finally {
    if (timeoutId !== undefined) clearTimeout(timeoutId);
  }
}

export const api = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>('GET', endpoint, undefined, options),
  post: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>('POST', endpoint, body, options),
  put: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>('PUT', endpoint, body, options),
  patch: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>('PATCH', endpoint, body, options),
  delete: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>('DELETE', endpoint, undefined, options),

  async download(endpoint: string, options?: RequestOptions): Promise<Blob> {
    const externalSignal = options?.signal;
    let internalController: AbortController | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    if (!externalSignal) {
      internalController = new AbortController();
      timeoutId = setTimeout(() => internalController!.abort(), REQUEST_TIMEOUT_MS);
    }

    const signal = externalSignal ?? internalController!.signal;

    try {
      const headers = getHeaders() as Record<string, string>;
      delete headers['Content-Type'];

      const res = await fetch(`${BASE_URL}${endpoint}`, { headers, signal });

      if (res.status === 401) handleUnauthorized(res.status);

      if (!res.ok) {
        throw new ApiError(res.status, ['Download failed']);
      }

      return await res.blob();
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        if (internalController) {
          throw new ApiError(0, ['Request timed out']);
        }
        throw err;
      }
      throw err;
    } finally {
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    }
  },
};

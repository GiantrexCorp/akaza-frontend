import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '@/test/mocks/server';
import { API_URL } from '@/test/mocks/handlers';
import { ApiError, BASE_URL, handleUnauthorized, api } from './client';

describe('ApiError', () => {
  it('creates error from string array', () => {
    const error = new ApiError(422, ['Field is required']);
    expect(error.status).toBe(422);
    expect(error.message).toBe('Field is required');
    expect(error.errors).toEqual(['Field is required']);
    expect(error.fieldErrors).toEqual({});
  });

  it('creates error from field errors object', () => {
    const error = new ApiError(422, { email: ['Email is required', 'Invalid format'] });
    expect(error.status).toBe(422);
    expect(error.message).toBe('Email is required');
    expect(error.errors).toEqual(['Email is required', 'Invalid format']);
    expect(error.fieldErrors).toEqual({ email: ['Email is required', 'Invalid format'] });
  });

  it('creates error from string', () => {
    const error = new ApiError(500, 'Server error');
    expect(error.message).toBe('Server error');
    expect(error.errors).toEqual(['Server error']);
  });

  it('uses fallback message when errors are empty', () => {
    const error = new ApiError(500, null, 'Something broke');
    expect(error.message).toBe('Something broke');
    expect(error.errors).toEqual([]);
  });

  it('uses default fallback message', () => {
    const error = new ApiError(500, []);
    expect(error.message).toBe('An error occurred');
  });

  it('handles mixed field errors with string values', () => {
    const error = new ApiError(422, { name: 'Required', tags: ['Tag 1 invalid'] });
    expect(error.fieldErrors.name).toEqual(['Required']);
    expect(error.fieldErrors.tags).toEqual(['Tag 1 invalid']);
  });
});

describe('BASE_URL', () => {
  it('defaults to localhost API', () => {
    expect(BASE_URL).toBe('http://127.0.0.1:8000/api');
  });
});

describe('handleUnauthorized', () => {
  beforeEach(() => {
    vi.spyOn(Storage.prototype, 'removeItem');
    vi.spyOn(window, 'dispatchEvent');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('throws ApiError with status 401', () => {
    expect(() => handleUnauthorized(401)).toThrow(ApiError);
    try {
      handleUnauthorized(401);
    } catch (e) {
      expect((e as ApiError).status).toBe(401);
      expect((e as ApiError).errors).toEqual(['Unauthorized']);
    }
  });

  it('removes auth_token from localStorage', () => {
    try {
      handleUnauthorized(401);
    } catch {
      // expected
    }
    expect(localStorage.removeItem).toHaveBeenCalledWith('auth_token');
  });
});

describe('api.get', () => {
  it('returns payload from successful API envelope response', async () => {
    server.use(
      http.get(`${API_URL}/test-endpoint`, () => {
        return HttpResponse.json({
          success: true,
          payload: { items: [1, 2, 3] },
        });
      }),
    );

    const result = await api.get<{ items: number[] }>('/test-endpoint');
    expect(result).toEqual({ items: [1, 2, 3] });
  });

  it('sends Authorization header when token is in localStorage', async () => {
    let capturedAuth = '';
    server.use(
      http.get(`${API_URL}/test-auth`, ({ request }) => {
        capturedAuth = request.headers.get('Authorization') || '';
        return HttpResponse.json({ success: true, payload: {} });
      }),
    );

    localStorage.setItem('auth_token', 'my-token');
    await api.get('/test-auth');
    localStorage.removeItem('auth_token');

    expect(capturedAuth).toBe('Bearer my-token');
  });

  it('throws ApiError on failed envelope response', async () => {
    server.use(
      http.get(`${API_URL}/test-fail`, () => {
        return HttpResponse.json({
          success: false,
          errors: ['Something went wrong'],
          status: 400,
        });
      }),
    );

    await expect(api.get('/test-fail')).rejects.toThrow(ApiError);
    try {
      await api.get('/test-fail');
    } catch (e) {
      expect((e as ApiError).status).toBe(400);
      expect((e as ApiError).errors).toEqual(['Something went wrong']);
    }
  });

  it('throws ApiError on non-ok response without envelope', async () => {
    server.use(
      http.get(`${API_URL}/test-500`, () => {
        return HttpResponse.json(
          { message: 'Internal Server Error' },
          { status: 500 },
        );
      }),
    );

    await expect(api.get('/test-500')).rejects.toThrow(ApiError);
    try {
      await api.get('/test-500');
    } catch (e) {
      expect((e as ApiError).status).toBe(500);
      expect((e as ApiError).message).toBe('Internal Server Error');
    }
  });

  it('handles 401 by dispatching unauthorized event', async () => {
    const dispatchSpy = vi.spyOn(window, 'dispatchEvent');
    server.use(
      http.get(`${API_URL}/test-401`, () => {
        return HttpResponse.json({}, { status: 401 });
      }),
    );

    await expect(api.get('/test-401')).rejects.toThrow(ApiError);
    expect(dispatchSpy).toHaveBeenCalled();
    const event = dispatchSpy.mock.calls.find(
      (call) => (call[0] as CustomEvent).type === 'auth:unauthorized',
    );
    expect(event).toBeTruthy();
    dispatchSpy.mockRestore();
  });

  it('supports external AbortSignal', async () => {
    server.use(
      http.get(`${API_URL}/test-abort`, async () => {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        return HttpResponse.json({ success: true, payload: {} });
      }),
    );

    const controller = new AbortController();
    const promise = api.get('/test-abort', { signal: controller.signal });
    controller.abort();

    await expect(promise).rejects.toThrow();
  });
});

describe('api.post', () => {
  it('sends body as JSON and returns payload', async () => {
    let capturedBody: unknown = null;
    server.use(
      http.post(`${API_URL}/test-post`, async ({ request }) => {
        capturedBody = await request.json();
        return HttpResponse.json({
          success: true,
          payload: { id: 1, created: true },
        });
      }),
    );

    const result = await api.post<{ id: number; created: boolean }>('/test-post', {
      name: 'Test',
      value: 42,
    });

    expect(result).toEqual({ id: 1, created: true });
    expect(capturedBody).toEqual({ name: 'Test', value: 42 });
  });

  it('throws ApiError with field errors on 422', async () => {
    server.use(
      http.post(`${API_URL}/test-validation`, () => {
        return HttpResponse.json({
          success: false,
          errors: { email: ['Email is required'], name: ['Name is too short'] },
          status: 422,
        });
      }),
    );

    try {
      await api.post('/test-validation', {});
    } catch (e) {
      const err = e as ApiError;
      expect(err.status).toBe(422);
      expect(err.fieldErrors.email).toEqual(['Email is required']);
      expect(err.fieldErrors.name).toEqual(['Name is too short']);
    }
  });
});

describe('api.put', () => {
  it('sends PUT request with body', async () => {
    let capturedMethod = '';
    server.use(
      http.put(`${API_URL}/test-put`, ({ request }) => {
        capturedMethod = request.method;
        return HttpResponse.json({ success: true, payload: { updated: true } });
      }),
    );

    const result = await api.put<{ updated: boolean }>('/test-put', { name: 'Updated' });
    expect(result).toEqual({ updated: true });
    expect(capturedMethod).toBe('PUT');
  });
});

describe('api.patch', () => {
  it('sends PATCH request with body', async () => {
    let capturedMethod = '';
    server.use(
      http.patch(`${API_URL}/test-patch`, ({ request }) => {
        capturedMethod = request.method;
        return HttpResponse.json({ success: true, payload: { patched: true } });
      }),
    );

    const result = await api.patch<{ patched: boolean }>('/test-patch', { status: 'active' });
    expect(result).toEqual({ patched: true });
    expect(capturedMethod).toBe('PATCH');
  });
});

describe('api.delete', () => {
  it('sends DELETE request', async () => {
    let capturedMethod = '';
    server.use(
      http.delete(`${API_URL}/test-delete`, ({ request }) => {
        capturedMethod = request.method;
        return HttpResponse.json({ success: true, payload: { deleted: true } });
      }),
    );

    const result = await api.delete<{ deleted: boolean }>('/test-delete');
    expect(result).toEqual({ deleted: true });
    expect(capturedMethod).toBe('DELETE');
  });
});

describe('api.download', () => {
  it('returns blob on success', async () => {
    const encoder = new TextEncoder();
    const body = encoder.encode('pdf-content');

    server.use(
      http.get(`${API_URL}/test-download`, () => {
        return new HttpResponse(body, {
          status: 200,
          headers: { 'Content-Type': 'application/pdf' },
        });
      }),
    );

    const blob = await api.download('/test-download');
    expect(blob.size).toBeGreaterThan(0);
    const text = await blob.text();
    expect(text).toBe('pdf-content');
  });

  it('throws ApiError on failed download', async () => {
    server.use(
      http.get(`${API_URL}/test-download-fail`, () => {
        return new HttpResponse(null, { status: 404 });
      }),
    );

    await expect(api.download('/test-download-fail')).rejects.toThrow(ApiError);
  });
});

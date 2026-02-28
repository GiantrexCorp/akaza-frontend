import { http, HttpResponse } from 'msw';

const API_URL = 'http://127.0.0.1:8000/api';

export const handlers = [
  http.post(`${API_URL}/auth/login`, () => {
    return HttpResponse.json({
      success: true,
      payload: {
        token: 'test-token-123',
        user: {
          id: 1,
          name: 'Test User',
          email: 'test@example.com',
          phone: null,
          role: 'customer',
        },
      },
    });
  }),

  http.post(`${API_URL}/auth/register`, () => {
    return HttpResponse.json({
      success: true,
      payload: {
        message: 'Registration successful',
      },
    });
  }),

  http.get(`${API_URL}/profile`, () => {
    return HttpResponse.json({
      success: true,
      payload: {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        phone: null,
        role: 'customer',
      },
    });
  }),

  http.get(`${API_URL}/settings/public`, () => {
    return HttpResponse.json({
      success: true,
      payload: [],
    });
  }),
];

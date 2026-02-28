import { http, HttpResponse } from 'msw';

export const API_URL = 'http://127.0.0.1:8000/api';

export const handlers = [
  http.post(`${API_URL}/auth/login`, () => {
    return HttpResponse.json({
      success: true,
      payload: {
        access_token: 'test-token-123',
        token_type: 'Bearer',
        user: {
          id: 1,
          name: 'Test User',
          email: 'test@example.com',
          phone: null,
          type: 'customer' as const,
          status: 'active' as const,
          locale: 'en' as const,
          last_active_at: null,
          roles: [{ id: 1, name: 'customer' }],
          permissions: [],
        },
      },
    });
  }),

  http.post(`${API_URL}/auth/register`, () => {
    return HttpResponse.json({
      success: true,
      payload: {
        access_token: 'test-token-456',
        token_type: 'Bearer',
        user: {
          id: 2,
          name: 'New User',
          email: 'new@example.com',
          phone: null,
          type: 'customer' as const,
          status: 'active' as const,
          locale: 'en' as const,
          last_active_at: null,
          roles: [{ id: 1, name: 'customer' }],
          permissions: [],
        },
      },
    });
  }),

  http.post(`${API_URL}/auth/logout`, () => {
    return HttpResponse.json({
      success: true,
      payload: { message: 'Logged out' },
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
        type: 'customer' as const,
        status: 'active' as const,
        locale: 'en' as const,
        last_active_at: null,
        roles: [{ id: 1, name: 'customer' }],
        permissions: [],
      },
    });
  }),

  http.get(`${API_URL}/settings/public`, () => {
    return HttpResponse.json({
      success: true,
      payload: [],
    });
  }),

  http.post(`${API_URL}/hotels/search`, () => {
    return HttpResponse.json({
      success: true,
      payload: {
        hotels: [
          { id: 'h1', name: 'Test Hotel', stars: 5, price: 200, currency: 'EUR' },
        ],
      },
    });
  }),

  http.post(`${API_URL}/hotels/checkrate`, () => {
    return HttpResponse.json({
      success: true,
      payload: { rateKey: 'rate-1', price: 200, currency: 'EUR' },
    });
  }),

  http.post(`${API_URL}/hotels/bookings`, () => {
    return HttpResponse.json({
      success: true,
      payload: { id: 1, reference: 'HB-001', status: 'confirmed' },
    });
  }),

  http.get(`${API_URL}/hotels/bookings/:id`, () => {
    return HttpResponse.json({
      success: true,
      payload: { id: 1, reference: 'HB-001', hotel_name: 'Test Hotel', status: 'confirmed' },
    });
  }),

  http.post(`${API_URL}/hotels/bookings/:id/cancel`, () => {
    return HttpResponse.json({
      success: true,
      payload: { id: 1, reference: 'HB-001', status: 'cancelled' },
    });
  }),

  http.get(`${API_URL}/hotels/bookings`, () => {
    return HttpResponse.json({
      success: true,
      payload: {
        data: [
          { id: 1, reference: 'HB-001', hotel_name: 'Test Hotel', status: 'confirmed' },
        ],
        meta: { current_page: 1, last_page: 1, total: 1 },
      },
    });
  }),

  http.get(`${API_URL}/tours/bookings/:id`, () => {
    return HttpResponse.json({
      success: true,
      payload: { id: 1, reference: 'TB-001', tour_title: 'Pyramids Tour', status: 'confirmed' },
    });
  }),

  http.get(`${API_URL}/tours/bookings`, () => {
    return HttpResponse.json({
      success: true,
      payload: {
        data: [
          { id: 1, reference: 'TB-001', tour_title: 'Pyramids Tour', status: 'confirmed' },
        ],
        meta: { current_page: 1, last_page: 1, total: 1 },
      },
    });
  }),

  http.post(`${API_URL}/tours/bookings/:id/cancel`, () => {
    return HttpResponse.json({
      success: true,
      payload: { id: 1, reference: 'TB-001', status: 'cancelled' },
    });
  }),

  http.post(`${API_URL}/tours/bookings`, () => {
    return HttpResponse.json({
      success: true,
      payload: { id: 1, reference: 'TB-001', status: 'confirmed' },
    });
  }),

  http.get(`${API_URL}/tours/:tourId/availabilities`, () => {
    return HttpResponse.json({
      success: true,
      payload: [
        { id: 1, date: '2026-03-15', slots_available: 10, status: 'available' },
      ],
    });
  }),

  http.get(`${API_URL}/tours/:slug`, () => {
    return HttpResponse.json({
      success: true,
      payload: {
        id: 1, slug: 'pyramids-tour', title: 'Pyramids Tour', price_per_person: 50,
        description: 'Visit the pyramids', duration: '8 hours', location: 'Giza',
      },
    });
  }),

  http.get(`${API_URL}/tours`, () => {
    return HttpResponse.json({
      success: true,
      payload: {
        data: [
          { id: 1, slug: 'pyramids-tour', title: 'Pyramids Tour', price_per_person: 50 },
        ],
        meta: { current_page: 1, last_page: 1, total: 1 },
      },
    });
  }),

  http.get(`${API_URL}/transfers/routes/:id/prices`, () => {
    return HttpResponse.json({
      success: true,
      payload: [
        { id: 1, vehicle_id: 1, price: 150, currency: 'EUR' },
      ],
    });
  }),

  http.get(`${API_URL}/transfers/vehicles`, () => {
    return HttpResponse.json({
      success: true,
      payload: [
        { id: 1, name: 'Sedan', type: 'sedan', max_passengers: 3 },
      ],
    });
  }),

  http.get(`${API_URL}/transfers/routes`, () => {
    return HttpResponse.json({
      success: true,
      payload: [
        { id: 1, pickup_name: 'Cairo Airport', dropoff_name: 'Downtown' },
      ],
    });
  }),

  http.get(`${API_URL}/transfers/bookings/:id`, () => {
    return HttpResponse.json({
      success: true,
      payload: { id: 1, reference: 'XB-001', status: 'confirmed' },
    });
  }),

  http.post(`${API_URL}/transfers/bookings/:id/cancel`, () => {
    return HttpResponse.json({
      success: true,
      payload: { id: 1, reference: 'XB-001', status: 'cancelled' },
    });
  }),

  http.get(`${API_URL}/transfers/bookings`, () => {
    return HttpResponse.json({
      success: true,
      payload: {
        data: [
          { id: 1, reference: 'XB-001', status: 'confirmed' },
        ],
        meta: { current_page: 1, last_page: 1, total: 1 },
      },
    });
  }),

  http.post(`${API_URL}/transfers/bookings`, () => {
    return HttpResponse.json({
      success: true,
      payload: { id: 1, reference: 'XB-001', status: 'confirmed' },
    });
  }),

  http.put(`${API_URL}/profile`, () => {
    return HttpResponse.json({
      success: true,
      payload: {
        id: 1, name: 'Updated User', email: 'test@example.com',
        phone: null, type: 'customer' as const, status: 'active' as const,
        locale: 'en' as const, last_active_at: null,
        roles: [{ id: 1, name: 'customer' }], permissions: [],
      },
    });
  }),

  http.post(`${API_URL}/profile/change-password`, () => {
    return HttpResponse.json({
      success: true,
      payload: { message: 'Password changed successfully' },
    });
  }),

  http.get(`${API_URL}/notifications`, () => {
    return HttpResponse.json({
      success: true,
      payload: {
        data: [
          { id: '1', type: 'booking_confirmed', message: 'Your booking is confirmed', read_at: null, created_at: '2026-02-28T10:00:00Z' },
        ],
        meta: { current_page: 1, last_page: 1, total: 1 },
      },
    });
  }),

  http.post(`${API_URL}/notifications/:id/read`, () => {
    return HttpResponse.json({
      success: true,
      payload: { id: '1', read_at: '2026-02-28T10:05:00Z' },
    });
  }),

  http.post(`${API_URL}/notifications/read-all`, () => {
    return HttpResponse.json({
      success: true,
      payload: { message: 'All notifications marked as read' },
    });
  }),
];

export const errorHandlers = {
  unauthorized: http.get(`${API_URL}/profile`, () => {
    return HttpResponse.json(
      { success: false, errors: ['Unauthorized'], status: 401 },
      { status: 401 },
    );
  }),

  validationError: http.post(`${API_URL}/auth/login`, () => {
    return HttpResponse.json(
      {
        success: false,
        errors: { email: ['The email field is required.'], password: ['The password field is required.'] },
        status: 422,
      },
      { status: 422 },
    );
  }),

  serverError: http.get(`${API_URL}/hotels/bookings`, () => {
    return HttpResponse.json(
      { success: false, errors: ['Internal server error'], status: 500 },
      { status: 500 },
    );
  }),

  networkError: http.get(`${API_URL}/profile`, () => {
    return HttpResponse.error();
  }),

  noAuthProfile: http.get(`${API_URL}/profile`, () => {
    return HttpResponse.json(
      { success: false, errors: ['Unauthenticated.'], status: 401 },
      { status: 401 },
    );
  }),
};

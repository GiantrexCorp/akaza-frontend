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

  // --- Admin Handlers ---

  // Admin Users
  http.get(`${API_URL}/admin/users`, () => {
    return HttpResponse.json({
      success: true,
      payload: {
        data: [{ id: 1, name: 'Admin User', email: 'admin@test.com', status: 'active', type: 'admin' }],
        meta: { current_page: 1, last_page: 1, total: 1 },
      },
    });
  }),

  http.get(`${API_URL}/admin/users/:id`, () => {
    return HttpResponse.json({
      success: true,
      payload: { id: 1, name: 'Admin User', email: 'admin@test.com', status: 'active', type: 'admin' },
    });
  }),

  http.post(`${API_URL}/admin/users`, () => {
    return HttpResponse.json({
      success: true,
      payload: { id: 2, name: 'New User', email: 'new@test.com', status: 'active', type: 'admin' },
    });
  }),

  http.put(`${API_URL}/admin/users/:id`, () => {
    return HttpResponse.json({
      success: true,
      payload: { id: 1, name: 'Updated User', email: 'admin@test.com', status: 'active', type: 'admin' },
    });
  }),

  http.delete(`${API_URL}/admin/users/:id`, () => {
    return HttpResponse.json({ success: true, payload: null });
  }),

  // Admin Roles
  http.get(`${API_URL}/admin/roles`, () => {
    return HttpResponse.json({
      success: true,
      payload: {
        data: [{ id: 1, name: 'admin', display_name: 'Administrator', permissions: [] }],
        meta: { current_page: 1, last_page: 1, total: 1 },
      },
    });
  }),

  http.get(`${API_URL}/admin/roles/:id`, () => {
    return HttpResponse.json({
      success: true,
      payload: { id: 1, name: 'admin', display_name: 'Administrator', permissions: [] },
    });
  }),

  http.post(`${API_URL}/admin/roles`, () => {
    return HttpResponse.json({
      success: true,
      payload: { id: 2, name: 'editor', display_name: 'Editor', permissions: [] },
    });
  }),

  http.put(`${API_URL}/admin/roles/:id`, () => {
    return HttpResponse.json({
      success: true,
      payload: { id: 1, name: 'admin', display_name: 'Super Admin', permissions: [] },
    });
  }),

  http.delete(`${API_URL}/admin/roles/:id`, () => {
    return HttpResponse.json({ success: true, payload: { message: 'Deleted' } });
  }),

  // Admin Customers
  http.get(`${API_URL}/admin/customers`, () => {
    return HttpResponse.json({
      success: true,
      payload: {
        data: [{ id: 1, name: 'John Doe', email: 'john@test.com', phone: '+201234567890', status: 'active' }],
        meta: { current_page: 1, last_page: 1, total: 1 },
      },
    });
  }),

  http.get(`${API_URL}/admin/customers/:id/booking-history`, () => {
    return HttpResponse.json({
      success: true,
      payload: [{ id: 1, type: 'hotel', reference: 'HB-100', status: 'confirmed', total: 500 }],
    });
  }),

  http.get(`${API_URL}/admin/customers/:id/notes`, () => {
    return HttpResponse.json({
      success: true,
      payload: [{ id: 1, content: 'VIP customer', type: 'general', created_at: '2026-02-28T10:00:00Z' }],
    });
  }),

  http.post(`${API_URL}/admin/customers/:id/notes`, () => {
    return HttpResponse.json({
      success: true,
      payload: { id: 2, content: 'New note', type: 'general', created_at: '2026-02-28T11:00:00Z' },
    });
  }),

  http.put(`${API_URL}/admin/customers/:id/notes/:noteId`, () => {
    return HttpResponse.json({
      success: true,
      payload: { id: 1, content: 'Updated note', type: 'general', created_at: '2026-02-28T10:00:00Z' },
    });
  }),

  http.delete(`${API_URL}/admin/customers/:id/notes/:noteId`, () => {
    return HttpResponse.json({ success: true, payload: null });
  }),

  http.get(`${API_URL}/admin/customers/:id`, () => {
    return HttpResponse.json({
      success: true,
      payload: { id: 1, name: 'John Doe', email: 'john@test.com', phone: '+201234567890', status: 'active' },
    });
  }),

  http.put(`${API_URL}/admin/customers/:id`, () => {
    return HttpResponse.json({
      success: true,
      payload: { id: 1, name: 'John Updated', email: 'john@test.com', phone: '+201234567890', status: 'active' },
    });
  }),

  // Admin Tours
  http.get(`${API_URL}/admin/tours`, () => {
    return HttpResponse.json({
      success: true,
      payload: [{ id: 1, title: 'Pyramids Tour', slug: 'pyramids-tour', status: 'active', price_per_person: 50 }],
    });
  }),

  http.get(`${API_URL}/admin/tours/:id/availabilities`, () => {
    return HttpResponse.json({
      success: true,
      payload: [{ id: 1, date: '2026-03-15', max_participants: 20, slots_available: 15, status: 'available' }],
    });
  }),

  http.post(`${API_URL}/admin/tours/:id/availabilities`, () => {
    return HttpResponse.json({
      success: true,
      payload: { id: 2, date: '2026-03-16', max_participants: 20, slots_available: 20, status: 'available' },
    });
  }),

  http.post(`${API_URL}/admin/tours/:id/availabilities/bulk`, () => {
    return HttpResponse.json({
      success: true,
      payload: [
        { id: 3, date: '2026-03-17', max_participants: 20, slots_available: 20, status: 'available' },
        { id: 4, date: '2026-03-18', max_participants: 20, slots_available: 20, status: 'available' },
      ],
    });
  }),

  http.put(`${API_URL}/admin/tours/:tourId/availabilities/:availId`, () => {
    return HttpResponse.json({
      success: true,
      payload: { id: 1, date: '2026-03-15', max_participants: 25, slots_available: 20, status: 'available' },
    });
  }),

  http.delete(`${API_URL}/admin/tours/:tourId/availabilities/:availId`, () => {
    return HttpResponse.json({ success: true, payload: { message: 'Deleted' } });
  }),

  http.post(`${API_URL}/admin/tours/:id/images`, () => {
    return HttpResponse.json({
      success: true,
      payload: { id: 1, title: 'Pyramids Tour', images: [{ id: 1, url: '/images/tour.jpg' }] },
    });
  }),

  http.delete(`${API_URL}/admin/tours/:tourId/images/:mediaId`, () => {
    return HttpResponse.json({ success: true, payload: { message: 'Deleted' } });
  }),

  http.get(`${API_URL}/admin/tours/:id`, () => {
    return HttpResponse.json({
      success: true,
      payload: { id: 1, title: 'Pyramids Tour', slug: 'pyramids-tour', status: 'active', price_per_person: 50 },
    });
  }),

  http.post(`${API_URL}/admin/tours`, () => {
    return HttpResponse.json({
      success: true,
      payload: { id: 2, title: 'Luxor Tour', slug: 'luxor-tour', status: 'active', price_per_person: 75 },
    });
  }),

  http.put(`${API_URL}/admin/tours/:id`, () => {
    return HttpResponse.json({
      success: true,
      payload: { id: 1, title: 'Updated Tour', slug: 'pyramids-tour', status: 'active', price_per_person: 60 },
    });
  }),

  http.delete(`${API_URL}/admin/tours/:id`, () => {
    return HttpResponse.json({ success: true, payload: { message: 'Deleted' } });
  }),

  // Admin Tour Bookings
  http.get(`${API_URL}/admin/tour-bookings`, () => {
    return HttpResponse.json({
      success: true,
      payload: [{ id: 1, booking_reference: 'TB-001', status: 'confirmed', tour: { title: 'Pyramids Tour' } }],
    });
  }),

  http.get(`${API_URL}/admin/tour-bookings/:id`, () => {
    return HttpResponse.json({
      success: true,
      payload: { id: 1, booking_reference: 'TB-001', status: 'confirmed', tour: { title: 'Pyramids Tour' } },
    });
  }),

  http.patch(`${API_URL}/admin/tour-bookings/:id/status`, () => {
    return HttpResponse.json({
      success: true,
      payload: { id: 1, booking_reference: 'TB-001', status: 'completed' },
    });
  }),

  // Admin Hotel Bookings
  http.get(`${API_URL}/admin/hotel-bookings`, () => {
    return HttpResponse.json({
      success: true,
      payload: {
        data: [{ id: 1, booking_reference: 'HB-001', status: 'confirmed', hotel_name: 'Four Seasons' }],
        meta: { current_page: 1, last_page: 1, total: 1 },
      },
    });
  }),

  http.get(`${API_URL}/admin/hotel-bookings/:id`, () => {
    return HttpResponse.json({
      success: true,
      payload: { id: 1, booking_reference: 'HB-001', status: 'confirmed', hotel_name: 'Four Seasons' },
    });
  }),

  http.post(`${API_URL}/admin/hotel-bookings/:id/reconcile`, () => {
    return HttpResponse.json({
      success: true,
      payload: { id: 1, booking_reference: 'HB-001', status: 'reconciled', hotel_name: 'Four Seasons' },
    });
  }),

  // Admin Transfer Vehicles
  http.get(`${API_URL}/admin/transfers/vehicles`, () => {
    return HttpResponse.json({
      success: true,
      payload: [{ id: 1, name: { en: 'Sedan' }, translated_name: 'Sedan', type: 'sedan', status: 'active', max_passengers: 3 }],
    });
  }),

  http.get(`${API_URL}/admin/transfers/vehicles/:id`, () => {
    return HttpResponse.json({
      success: true,
      payload: { id: 1, name: { en: 'Sedan' }, translated_name: 'Sedan', type: 'sedan', status: 'active', max_passengers: 3 },
    });
  }),

  http.post(`${API_URL}/admin/transfers/vehicles`, () => {
    return HttpResponse.json({
      success: true,
      payload: { id: 2, name: { en: 'SUV' }, translated_name: 'SUV', type: 'suv', status: 'active', max_passengers: 5 },
    });
  }),

  http.put(`${API_URL}/admin/transfers/vehicles/:id`, () => {
    return HttpResponse.json({
      success: true,
      payload: { id: 1, name: { en: 'Updated Sedan' }, translated_name: 'Updated Sedan', type: 'sedan', status: 'active', max_passengers: 4 },
    });
  }),

  http.delete(`${API_URL}/admin/transfers/vehicles/:id`, () => {
    return HttpResponse.json({ success: true, payload: { message: 'Deleted' } });
  }),

  http.delete(`${API_URL}/admin/transfers/vehicles/:id/image`, () => {
    return HttpResponse.json({ success: true, payload: { message: 'Deleted' } });
  }),

  // Admin Transfer Routes
  http.get(`${API_URL}/admin/transfers/routes`, () => {
    return HttpResponse.json({
      success: true,
      payload: [{ id: 1, transfer_type: 'airport', translated_pickup_name: 'Cairo Airport', translated_dropoff_name: 'Downtown', status: 'active', prices: [] }],
    });
  }),

  http.get(`${API_URL}/admin/transfers/routes/:id`, () => {
    return HttpResponse.json({
      success: true,
      payload: { id: 1, transfer_type: 'airport', translated_pickup_name: 'Cairo Airport', translated_dropoff_name: 'Downtown', status: 'active', prices: [] },
    });
  }),

  http.post(`${API_URL}/admin/transfers/routes`, () => {
    return HttpResponse.json({
      success: true,
      payload: { id: 2, transfer_type: 'city', translated_pickup_name: 'Giza', translated_dropoff_name: 'Luxor', status: 'active', prices: [] },
    });
  }),

  http.put(`${API_URL}/admin/transfers/routes/:id`, () => {
    return HttpResponse.json({
      success: true,
      payload: { id: 1, transfer_type: 'airport', translated_pickup_name: 'Cairo Airport', translated_dropoff_name: 'Pyramids', status: 'active', prices: [] },
    });
  }),

  http.delete(`${API_URL}/admin/transfers/routes/:id`, () => {
    return HttpResponse.json({ success: true, payload: { message: 'Deleted' } });
  }),

  http.post(`${API_URL}/admin/transfers/routes/:routeId/prices`, () => {
    return HttpResponse.json({
      success: true,
      payload: { id: 1, transfer_type: 'airport', translated_pickup_name: 'Cairo Airport', translated_dropoff_name: 'Downtown', status: 'active', prices: [{ id: 1, price: 100, currency: 'EUR', transfer_vehicle_id: 1 }] },
    });
  }),

  // Admin Transfer Bookings
  http.get(`${API_URL}/admin/transfer-bookings`, () => {
    return HttpResponse.json({
      success: true,
      payload: [{ id: 1, booking_reference: 'XB-001', status: 'confirmed' }],
    });
  }),

  http.get(`${API_URL}/admin/transfer-bookings/:id`, () => {
    return HttpResponse.json({
      success: true,
      payload: { id: 1, booking_reference: 'XB-001', status: 'confirmed' },
    });
  }),

  http.patch(`${API_URL}/admin/transfer-bookings/:id/status`, () => {
    return HttpResponse.json({
      success: true,
      payload: { id: 1, booking_reference: 'XB-001', status: 'completed' },
    });
  }),

  // Admin Leads
  http.get(`${API_URL}/admin/leads`, () => {
    return HttpResponse.json({
      success: true,
      payload: {
        data: [{ id: 1, name: 'Jane Lead', email: 'jane@test.com', status: 'new', source: 'website' }],
        meta: { current_page: 1, last_page: 1, total: 1 },
      },
    });
  }),

  http.get(`${API_URL}/admin/leads/:id`, () => {
    return HttpResponse.json({
      success: true,
      payload: { id: 1, name: 'Jane Lead', email: 'jane@test.com', status: 'new', source: 'website' },
    });
  }),

  http.post(`${API_URL}/admin/leads`, () => {
    return HttpResponse.json({
      success: true,
      payload: { id: 2, name: 'New Lead', email: 'lead@test.com', status: 'new', source: 'manual' },
    });
  }),

  http.put(`${API_URL}/admin/leads/:id`, () => {
    return HttpResponse.json({
      success: true,
      payload: { id: 1, name: 'Jane Lead', email: 'jane@test.com', status: 'contacted', source: 'website' },
    });
  }),

  http.post(`${API_URL}/admin/leads/:id/convert`, () => {
    return HttpResponse.json({
      success: true,
      payload: { id: 1, name: 'Jane Lead', email: 'jane@test.com', status: 'converted', source: 'website' },
    });
  }),

  // Admin Finance
  http.get(`${API_URL}/admin/finance/dashboard`, () => {
    return HttpResponse.json({
      success: true,
      payload: { total_revenue: 50000, total_bookings: 120, pending_amount: 5000 },
    });
  }),

  http.get(`${API_URL}/admin/finance/revenue`, () => {
    return HttpResponse.json({
      success: true,
      payload: [{ month: '2026-01', revenue: 15000 }, { month: '2026-02', revenue: 18000 }],
    });
  }),

  http.get(`${API_URL}/admin/finance/reports`, () => {
    return HttpResponse.json({
      success: true,
      payload: { total_revenue: 50000, total_expenses: 20000, net_profit: 30000, bookings: [] },
    });
  }),

  http.get(`${API_URL}/admin/finance/booking-status-summary`, () => {
    return HttpResponse.json({
      success: true,
      payload: { confirmed: 80, pending: 20, cancelled: 10, completed: 10 },
    });
  }),

  // Admin Audit
  http.get(`${API_URL}/admin/audit-logs`, () => {
    return HttpResponse.json({
      success: true,
      payload: {
        data: [{ id: 1, action: 'create', entity_type: 'user', entity_id: 1, user_id: 1, created_at: '2026-02-28T10:00:00Z' }],
        meta: { current_page: 1, last_page: 1, total: 1 },
      },
    });
  }),

  http.get(`${API_URL}/admin/audit-logs/:id`, () => {
    return HttpResponse.json({
      success: true,
      payload: { id: 1, action: 'create', entity_type: 'user', entity_id: 1, user_id: 1, changes: {}, created_at: '2026-02-28T10:00:00Z' },
    });
  }),

  // Admin Notification Templates
  http.get(`${API_URL}/admin/notification-templates`, () => {
    return HttpResponse.json({
      success: true,
      payload: [{ id: 1, name: 'booking_confirmed', subject: { en: 'Booking Confirmed' }, channel: 'mail' }],
    });
  }),

  http.get(`${API_URL}/admin/notification-templates/:id`, () => {
    return HttpResponse.json({
      success: true,
      payload: { id: 1, name: 'booking_confirmed', subject: { en: 'Booking Confirmed' }, body: { en: 'Your booking is confirmed.' }, channel: 'mail' },
    });
  }),

  http.put(`${API_URL}/admin/notification-templates/:id`, () => {
    return HttpResponse.json({
      success: true,
      payload: { message: 'Updated', template: { id: 1, name: 'booking_confirmed', subject: { en: 'Updated Subject' }, channel: 'mail' } },
    });
  }),

  // Admin Notification Logs
  http.get(`${API_URL}/admin/notification-logs`, () => {
    return HttpResponse.json({
      success: true,
      payload: [{ id: 1, type: 'booking_confirmed', channel: 'mail', status: 'sent', created_at: '2026-02-28T10:00:00Z' }],
    });
  }),

  http.get(`${API_URL}/admin/notification-logs/:id`, () => {
    return HttpResponse.json({
      success: true,
      payload: { id: 1, type: 'booking_confirmed', channel: 'mail', status: 'sent', user: { id: 1, name: 'Test User' }, created_at: '2026-02-28T10:00:00Z' },
    });
  }),

  // Admin Settings
  http.get(`${API_URL}/admin/settings`, () => {
    return HttpResponse.json({
      success: true,
      payload: { general: { site_name: 'Akaza Travel' }, payment: { currency: 'EUR' } },
    });
  }),

  http.put(`${API_URL}/admin/settings`, () => {
    return HttpResponse.json({
      success: true,
      payload: { message: 'Settings updated' },
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

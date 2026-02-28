export const queryKeys = {
  settings: {
    public: () => ['settings', 'public'] as const,
  },

  tours: {
    list: (params?: string) => ['tours', 'list', params] as const,
    detail: (slug: string) => ['tours', 'detail', slug] as const,
    availabilities: (tourId: string) => ['tours', 'availabilities', tourId] as const,
  },

  hotels: {
    bookings: (params?: string) => ['hotels', 'bookings', params] as const,
    bookingDetail: (id: string) => ['hotels', 'bookings', id] as const,
  },

  transfers: {
    vehicles: () => ['transfers', 'vehicles'] as const,
    routes: () => ['transfers', 'routes'] as const,
    routePrices: (routeId: string) => ['transfers', 'routePrices', routeId] as const,
    bookings: (params?: string) => ['transfers', 'bookings', params] as const,
    bookingDetail: (id: string) => ['transfers', 'bookings', id] as const,
  },

  bookings: {
    hotels: (params?: string) => ['bookings', 'hotels', params] as const,
    tours: (params?: string) => ['bookings', 'tours', params] as const,
    transfers: (params?: string) => ['bookings', 'transfers', params] as const,
    hotelDetail: (id: string) => ['bookings', 'hotels', 'detail', id] as const,
    tourDetail: (id: string) => ['bookings', 'tours', 'detail', id] as const,
    transferDetail: (id: string) => ['bookings', 'transfers', 'detail', id] as const,
  },

  profile: {
    me: () => ['profile', 'me'] as const,
  },

  notifications: {
    list: (params?: string) => ['notifications', 'list', params] as const,
  },

  admin: {
    users: {
      all: () => ['admin', 'users'] as const,
      list: (params?: string) => ['admin', 'users', 'list', params] as const,
      detail: (id: number) => ['admin', 'users', 'detail', id] as const,
    },
    roles: {
      all: () => ['admin', 'roles'] as const,
      list: (params?: string) => ['admin', 'roles', 'list', params] as const,
      detail: (id: number) => ['admin', 'roles', 'detail', id] as const,
    },
    hotelBookings: {
      all: () => ['admin', 'hotelBookings'] as const,
      list: (params?: string) => ['admin', 'hotelBookings', 'list', params] as const,
      detail: (id: number) => ['admin', 'hotelBookings', 'detail', id] as const,
    },
    tourBookings: {
      all: () => ['admin', 'tourBookings'] as const,
      list: (params?: string) => ['admin', 'tourBookings', 'list', params] as const,
      detail: (id: number) => ['admin', 'tourBookings', 'detail', id] as const,
    },
    transferBookings: {
      all: () => ['admin', 'transferBookings'] as const,
      list: (params?: string) => ['admin', 'transferBookings', 'list', params] as const,
      detail: (id: number) => ['admin', 'transferBookings', 'detail', id] as const,
    },
    tours: {
      all: () => ['admin', 'tours'] as const,
      list: (params?: string) => ['admin', 'tours', 'list', params] as const,
      detail: (id: number) => ['admin', 'tours', 'detail', id] as const,
      availabilities: (tourId: number) => ['admin', 'tours', 'availabilities', tourId] as const,
    },
    transfers: {
      all: () => ['admin', 'transfers'] as const,
      vehiclesAll: () => ['admin', 'transfers', 'vehicles'] as const,
      vehicles: (params?: string) => ['admin', 'transfers', 'vehicles', params] as const,
      vehicleDetail: (id: number) => ['admin', 'transfers', 'vehicles', 'detail', id] as const,
      routesAll: () => ['admin', 'transfers', 'routes'] as const,
      routes: (params?: string) => ['admin', 'transfers', 'routes', params] as const,
      routeDetail: (id: number) => ['admin', 'transfers', 'routes', 'detail', id] as const,
    },
    customers: {
      all: () => ['admin', 'customers'] as const,
      list: (params?: string) => ['admin', 'customers', 'list', params] as const,
      detail: (id: number) => ['admin', 'customers', 'detail', id] as const,
      notes: (customerId: number) => ['admin', 'customers', 'notes', customerId] as const,
      bookingHistory: (id: number) => ['admin', 'customers', 'bookingHistory', id] as const,
    },
    leads: {
      all: () => ['admin', 'leads'] as const,
      list: (params?: string) => ['admin', 'leads', 'list', params] as const,
      detail: (id: number) => ['admin', 'leads', 'detail', id] as const,
    },
    finance: {
      dashboard: () => ['admin', 'finance', 'dashboard'] as const,
      revenue: (params?: string) => ['admin', 'finance', 'revenue', params] as const,
      report: (params?: string) => ['admin', 'finance', 'report', params] as const,
      bookingStatusSummary: () => ['admin', 'finance', 'bookingStatusSummary'] as const,
    },
    audit: {
      list: (params?: string) => ['admin', 'audit', 'list', params] as const,
      detail: (id: number) => ['admin', 'audit', 'detail', id] as const,
    },
    notifications: {
      all: () => ['admin', 'notifications'] as const,
      templates: (params?: string) => ['admin', 'notifications', 'templates', params] as const,
      templateDetail: (id: number) => ['admin', 'notifications', 'templateDetail', id] as const,
      logs: (params?: string) => ['admin', 'notifications', 'logs', params] as const,
      logDetail: (id: number) => ['admin', 'notifications', 'logDetail', id] as const,
    },
    settings: {
      all: () => ['admin', 'settings'] as const,
      list: () => ['admin', 'settings', 'list'] as const,
      group: (group: string) => ['admin', 'settings', 'group', group] as const,
    },
  },
} as const;

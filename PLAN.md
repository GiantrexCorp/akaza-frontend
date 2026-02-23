# Akaza Travel — Frontend Pages Plan

## Current State

**Built**: Landing page only (Home with 6 sections, theme toggle, tabbed search + cards)
**Backend API**: Fully built — User auth, Hotel (Hotelbeds), Tour, Transfer, Settings, Notifications
**Frontend repo**: Next.js 16, Tailwind v4, TypeScript strict, dark luxury aesthetic

---

## Foundation Layer (Build First)

Before any pages, we need shared infrastructure.

### F1. API Client (`src/lib/api/`)

- `client.ts` — Axios/fetch wrapper with base URL from `NEXT_PUBLIC_API_URL`, Bearer token injection, response envelope unwrapping (`{ status, success, payload, errors }`)
- `auth.ts` — Login, register, forgot/reset password, logout calls
- `hotels.ts` — Search, checkrate, bookings CRUD, cancel, voucher download
- `tours.ts` — List tours, get tour detail, availabilities, bookings CRUD, cancel, voucher
- `transfers.ts` — Vehicles, routes, route prices, bookings CRUD, cancel, voucher
- `profile.ts` — Get/update profile, change password
- `notifications.ts` — List, mark read, mark all read
- `settings.ts` — Get public settings

### F2. TypeScript Types (`src/types/`)

- `api.ts` — Envelope type (`ApiResponse<T>`), pagination types
- `auth.ts` — User, AuthResponse, LoginRequest, RegisterRequest
- `hotel.ts` — HotelSearchResult, HotelRoom, HotelBooking, HotelBookingRoom, SearchParams
- `tour.ts` — Tour, TourAvailability, TourBooking, TourBookingGuest
- `transfer.ts` — TransferVehicle, TransferRoute, TransferRoutePrice, TransferBooking
- `notification.ts` — NotificationLog
- `settings.ts` — PublicSetting

### F3. Auth Context (`src/lib/auth/`)

- `AuthProvider.tsx` — React context for user state, token storage (localStorage), login/logout handlers
- `useAuth.ts` — Hook to access auth state
- `ProtectedRoute.tsx` — Wrapper that redirects to login if unauthenticated

### F4. Shared UI Components (`src/components/ui/`)

- `Button.tsx` — Variants: primary, outline, ghost, gold-gradient (all sharp edges, matching design system)
- `Input.tsx` — Underline-style input with icon slot (matching SearchWidget pattern)
- `Select.tsx` — Custom dropdown with design system styling
- `DatePicker.tsx` — Calendar date picker (sharp edges, gold accents)
- `Modal.tsx` — Centered overlay with glass morphism
- `Badge.tsx` — Status badges (colored per booking status)
- `Spinner.tsx` — Loading indicator
- `Toast.tsx` — Notification toasts for success/error feedback
- `Breadcrumb.tsx` — Navigation breadcrumbs
- `EmptyState.tsx` — Illustration + message for empty lists
- `Pagination.tsx` — Page navigation for lists

### F5. Layout Components

- `PageHeader.tsx` — Reusable hero-style page header (title, subtitle, breadcrumb, background)
- `SectionWrapper.tsx` — Consistent section spacing (`py-32 max-w-7xl mx-auto px-6`)
- `DashboardLayout.tsx` — Sidebar + content layout for user dashboard pages

---

## Pages by Feature Area

### 1. Authentication Pages

#### 1A. Login — `/login`
- Email + password fields (underline-style inputs)
- "Remember me" checkbox
- "Forgot password?" link
- Login button (gold gradient)
- "Don't have an account? Register" link
- Background: subtle gradient or hero image with dark overlay
- On success: redirect to home or previous page, store token

#### 1B. Register — `/register`
- Fields: Name, Email, Phone, Password, Confirm Password
- Terms & conditions checkbox
- Register button
- "Already have an account? Login" link
- Same visual style as login
- On success: auto-login and redirect to home

#### 1C. Forgot Password — `/forgot-password`
- Email field
- Submit button
- Success message: "Check your email for reset link"
- Back to login link

#### 1D. Reset Password — `/reset-password`
- Token from URL params
- New password + confirm password
- Submit button
- On success: redirect to login with success message

---

### 2. Hotel Pages

#### 2A. Hotel Search Results — `/hotels/search`
- Triggered from SearchWidget on home page (or direct URL with query params)
- Query params: `destination`, `checkIn`, `checkOut`, `adults`, `children`
- Results grid/list toggle
- Each result card:
  - Hotel name, star category, destination
  - Min/max selling price range
  - Currency
  - "View Rooms" CTA
- Sort by: price (low/high), name
- Filter sidebar: price range, star rating, board type
- Loading skeleton while searching
- Empty state if no results
- Pagination

#### 2B. Hotel Room Selection — `/hotels/search/rooms?rateKeys=...`
- After selecting a hotel, call checkRate API with selected rate keys
- Display rooms with:
  - Room name, board type (BB, HB, AI etc.)
  - Selling price per room
  - Occupancy (adults, children)
  - Cancellation policy summary
  - Rate type indicator
- "Select Room" button per room
- Selected rooms summary sidebar (sticky)
- "Proceed to Booking" button

#### 2C. Hotel Booking Form — `/hotels/book`
- Protected route (must be logged in)
- Booking summary at top (hotel, dates, rooms, total price)
- Holder information: name, surname, email, phone
- Guest details per room: name, surname, type (adult/child), age (if child)
- Special requests textarea
- Price breakdown: net price, markup, total
- Terms acceptance checkbox
- "Confirm Booking" button
- On success: redirect to booking confirmation

#### 2D. Hotel Booking Confirmation — `/hotels/bookings/[id]/confirmation`
- Protected route
- Success banner with booking reference (AKZ-H-xxx)
- Booking details: hotel, dates, rooms, guests
- Status badge
- Download voucher button (if confirmed)
- "View My Bookings" link
- "Back to Home" link

---

### 3. Tour Pages

#### 3A. Tours Listing — `/tours`
- Grid of tour cards (reuse DestinationCard pattern, adapt for full page)
- Each card: image, title, location, duration, price per person
- Filter: location, price range, duration
- Sort: price, name, duration
- Pagination
- Search/filter bar at top

#### 3B. Tour Detail — `/tours/[slug]`
- Hero image gallery (Spatie media images)
- Tour title (multilingual), location with map pin
- Duration (hours/days), price per person
- Description (multilingual)
- Highlights list (checkmarks)
- Includes / Excludes lists (check / x icons)
- Availability calendar — show available dates with remaining spots and prices
  - Green = available, Orange = few spots, Gray = sold out
  - Click date to select
- Selected date + guest count form
- "Book Now" button → goes to booking form
- Back to tours link

#### 3C. Tour Booking Form — `/tours/book`
- Protected route
- Booking summary: tour name, date, time, price per person
- Contact info: name, email, phone
- Guest list: add/remove guests with name, surname, type (adult/child), age
- Number of guests (must match guest list)
- Special requests textarea
- Price breakdown: guests × price = total
- "Confirm Booking" button

#### 3D. Tour Booking Confirmation — `/tours/bookings/[id]/confirmation`
- Same pattern as hotel confirmation
- Booking reference (AKZ-T-xxx)
- Tour name, date, guests
- Voucher download

---

### 4. Transfer Pages

#### 4A. Transfers Browse — `/transfers`
- Two sections:
  - **Routes**: List available transfer routes (grouped by type: Airport, City, Chauffeur)
  - **Vehicles**: Grid of vehicle cards (reuse DestinationCard feature-list variant)
- Each route shows: pickup → dropoff, type badge
- Each vehicle shows: image, name, type, max passengers, max luggage, features
- "Get Price" or "Book Now" CTA per route
- Interactive: select route → see vehicle options with prices

#### 4B. Transfer Booking Form — `/transfers/book`
- Protected route
- Selected route + vehicle summary with price
- Pickup details: date, time
- Passengers count, luggage count
- Contact: name, email, phone
- Flight number (optional, shown for airport transfers)
- Special requests textarea
- Price display
- "Confirm Booking" button

#### 4C. Transfer Booking Confirmation — `/transfers/bookings/[id]/confirmation`
- Same pattern as others
- Booking reference (AKZ-X-xxx)
- Route, vehicle, pickup details
- Voucher download

---

### 5. User Dashboard Pages

All under `/dashboard` — protected routes, use DashboardLayout with sidebar.

#### 5A. Dashboard Sidebar Navigation
- My Bookings (default)
- Profile
- Notifications
- Logout

#### 5B. My Bookings — `/dashboard/bookings`
- Tabbed view: Hotels | Tours | Transfers | All
- Each booking row/card:
  - Booking reference
  - Service name (hotel/tour/transfer name)
  - Date(s)
  - Status badge (colored per status enum)
  - Total price
  - Actions: View Details, Download Voucher (if confirmed), Cancel (if cancellable)
- Sort by: date, status
- Filter by: status
- Empty state per tab

#### 5C. Hotel Booking Detail — `/dashboard/bookings/hotels/[id]`
- Full booking details
- Status timeline (from status logs)
- Hotel info, dates, rooms with guests
- Price breakdown
- Cancellation policy display
- Actions:
  - Download Voucher (if confirmed)
  - Cancel Booking (if `is_cancellable`) — show cancellation cost first via API, then confirm modal

#### 5D. Tour Booking Detail — `/dashboard/bookings/tours/[id]`
- Same pattern — tour info, date, guest list, status timeline
- Voucher download, cancel action

#### 5E. Transfer Booking Detail — `/dashboard/bookings/transfers/[id]`
- Same pattern — route, vehicle, pickup info, status timeline
- Voucher download, cancel action

#### 5F. Profile — `/dashboard/profile`
- Current user info display
- Edit form: name, email, phone, locale (en/de/fr)
- Change password section (current + new + confirm)
- Save buttons per section

#### 5G. Notifications — `/dashboard/notifications`
- List of notifications (NotificationLog)
- Each: subject, type badge, timestamp, read/unread indicator
- Click to expand details
- "Mark all as read" button
- Unread count badge in sidebar nav

---

### 6. Static Pages

#### 6A. About Us — `/about`
- Company story, mission, values
- Team section (optional)
- Uses content from public settings API or hardcoded initially

#### 6B. Contact — `/contact`
- Contact form: name, email, subject, message
- Office information (from OfficeSection data)
- Map embed
- Phone + email + address

#### 6C. Terms & Conditions — `/terms`
- Legal text (from settings API or static)

#### 6D. Privacy Policy — `/privacy`
- Privacy text (from settings API or static)

---

## Page Count Summary

| Area | Pages | Route |
|------|-------|-------|
| Auth | 4 | `/login`, `/register`, `/forgot-password`, `/reset-password` |
| Hotels | 4 | `/hotels/search`, `/hotels/search/rooms`, `/hotels/book`, `/hotels/bookings/[id]/confirmation` |
| Tours | 4 | `/tours`, `/tours/[slug]`, `/tours/book`, `/tours/bookings/[id]/confirmation` |
| Transfers | 3 | `/transfers`, `/transfers/book`, `/transfers/bookings/[id]/confirmation` |
| Dashboard | 7 | `/dashboard/bookings`, `/dashboard/bookings/hotels/[id]`, `/dashboard/bookings/tours/[id]`, `/dashboard/bookings/transfers/[id]`, `/dashboard/profile`, `/dashboard/notifications`, (sidebar layout) |
| Static | 4 | `/about`, `/contact`, `/terms`, `/privacy` |
| **Total** | **26** | |

---

## Implementation Order (Phases)

### Phase 1 — Foundation + Auth (must come first)
1. F1: API client
2. F2: TypeScript types
3. F3: Auth context + protected route
4. F4: Shared UI components (Button, Input, Modal, Badge, Spinner, Toast)
5. F5: Layout components (PageHeader, DashboardLayout)
6. 1A–1D: Auth pages (Login, Register, Forgot/Reset Password)

### Phase 2 — Hotels (core revenue feature)
7. 2A: Hotel search results
8. 2B: Room selection (checkrate)
9. 2C: Hotel booking form
10. 2D: Hotel booking confirmation

### Phase 3 — Tours
11. 3A: Tours listing
12. 3B: Tour detail + availability calendar
13. 3C: Tour booking form
14. 3D: Tour booking confirmation

### Phase 4 — Transfers
15. 4A: Transfers browse
16. 4B: Transfer booking form
17. 4C: Transfer booking confirmation

### Phase 5 — Dashboard
18. 5A–5B: Dashboard layout + My Bookings
19. 5C–5E: Booking detail pages (hotel, tour, transfer)
20. 5F: Profile page
21. 5G: Notifications page

### Phase 6 — Static Pages
22. 6A–6D: About, Contact, Terms, Privacy

---

## Key Design Decisions

1. **All pages follow the existing design system** — dark bg, gold accents, sharp edges, serif headings, sans body
2. **Server components by default** — only add `"use client"` when hooks/interactivity needed
3. **Data fetching in server components** where possible (tours listing, tour detail), client-side for interactive flows (hotel search, booking forms)
4. **Navbar updates**: Add logged-in state (avatar/name dropdown replacing Login button), notification bell with unread count
5. **Footer links**: Wire up to actual pages (About, Contact, Terms, Privacy)
6. **Language switcher**: Integrate with user locale preference and API `Accept-Language` header
7. **Voucher downloads**: Handle binary PDF response, trigger browser download
8. **Error handling**: Toast notifications for API errors, inline validation for forms
9. **Loading states**: Skeleton screens matching card/list layouts
10. **SEO**: Proper metadata per page, OpenGraph tags for tours/hotels

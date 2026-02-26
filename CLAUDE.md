# Akaza Travel — AI Development Guidelines

## Commits

- **Do NOT add `Co-Authored-By` trailers** — no AI attribution in commits

## Project Overview

Akaza Travel is a luxury Egypt travel platform. The Next.js frontend connects to a Laravel backend API via a fully integrated API client layer. The design language is dark, elegant, and editorial — sharp edges, warm gold/teal accents, serif headings, no rounded corners.

**This will be a large-scale product built heavily with AI assistance. Every AI session must read this file and `docs/DESIGN_SYSTEM.md` before writing any code.**

## Tech Stack

- **Framework**: Next.js 16+ (App Router) with TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 (uses `@theme inline` in globals.css, NOT tailwind.config)
- **Icons**: `lucide-react` — the ONLY icon library. Never add Material Icons, Heroicons, etc.
- **Fonts**: Playfair Display (serif headings) + Plus Jakarta Sans (sans body) via `next/font/google`
- **Package manager**: npm

## Critical Rules

### Design Fidelity

1. **Read `docs/DESIGN_SYSTEM.md` before creating or modifying any UI component.** It contains exact colors, typography, spacing, component patterns, card variants, and image references.
2. **No rounded corners.** Never use `rounded-*` classes. The entire design uses sharp/square edges. The only exception is `rounded-full` for decorative circles (glows, blurs, pills/badges).
3. **Use design tokens from globals.css.** Never hardcode hex colors — use `text-primary`, `bg-bg-dark`, `bg-primary-gradient-end`, etc.
4. **Serif for headings, sans for body.** Use `font-serif` (Playfair Display) for h1–h4, prices, hero buttons, card titles, input text. Use `font-sans` (Plus Jakarta Sans) for everything else.
5. **Sharp, elegant aesthetic.** When in doubt, look at existing components for the visual pattern.
6. **Image grayscale treatment.** Card images use `grayscale-[30%]` (excursions) or `grayscale-[20%]` (hotels/vehicles). Hover removes grayscale with `group-hover:grayscale-0`.

### Color Tokens (defined in globals.css — dark theme defaults)

| Token | Hex | Usage |
|-------|-----|-------|
| `primary` | `#b97532` | Warm gold — buttons, links, highlights, active states |
| `primary-dark` | `#753f20` | Darker gold — pressed states |
| `primary-gradient-end` | `#e2af6d` | Button gradient end, search hover |
| `accent` | `#346d80` | Teal — brand gradient text highlights |
| `accent-light` | `#97b9c1` | Light teal — brand gradient text endpoint |
| `secondary` | `#688e99` | Muted teal-gray |
| `bg-light` | `#f4f2f0` | Light mode background |
| `bg-dark` | `#0b171b` | Main page background |
| `bg-darker` | `#060e11` | Card overlays, gradient endpoints |
| `bg-card` | `#102127` | Elevated surfaces |
| `bg-vip` | `#0b1a20` | VIP section, office card background |
| `bg-footer` | `#070f12` | Footer background |

### Dual-Layer Theming System

The project uses two layers of color tokens:

1. **`@theme inline` tokens** — Tailwind utility classes (`bg-primary`, `text-bg-dark`, etc.). These are the base palette.
2. **CSS custom properties** — `var(--surface-*)`, `var(--text-*)`, `var(--line-*)`, `var(--field-*)` for semantic theming. These swap values between `data-theme="dark"` and `data-theme="light"`.

**When to use which:**
- Use Tailwind tokens (`bg-primary`, `text-primary`) for brand colors that don't change per theme.
- Use CSS vars (`var(--surface-page)`, `var(--text-primary)`, `var(--line-soft)`) for surfaces, text, and borders that adapt to theme.

Key CSS custom property groups:
- `--surface-*`: page, nav, card, section, footer backgrounds
- `--text-*`: primary, secondary, muted text colors
- `--line-*`: soft (subtle dividers), strong (visible borders)
- `--field-*`: text and placeholder colors for form inputs
- `--hero-*`: overlay gradients and hero-specific colors
- `--contact-*`: contact form styling tokens
- `--search-widget-*`: search widget surfaces and borders
- `--destinations-*`: destinations section-specific tokens
- `--experiences-*`: experiences page-specific tokens

Theme switching is via `data-theme` attribute on `<html>`, toggled by `ThemeToggle` in the Navbar. A blocking `<script>` in `layout.tsx` reads `localStorage('theme')` to prevent flash.

### Code Architecture

1. **One component per file.** PascalCase filenames matching the export name.
2. **Components go in `src/components/`.** Group by feature subdirectories as the project grows (e.g., `src/components/booking/`, `src/components/destinations/`).
3. **Pages are thin.** `page.tsx` files should only import and compose components — no inline markup, no business logic.
4. **Reusable over one-off.** Before creating a new component, check if an existing one can be extended with props. Prefer composition over duplication.
5. **Props over hardcoding.** Data (titles, descriptions, prices, images) should be passed as props, not hardcoded inside components. This prepares us for API integration.
6. **TypeScript interfaces for all props.** Define prop types explicitly, not inline.
7. **"use client" only when needed.** Only add `"use client"` for components that use hooks, event handlers, or browser APIs. Keep as many components as server components as possible.
8. **Shared state pattern.** When multiple components need the same state (like the tab-linked SearchWidget + DestinationsSection), create a client wrapper component (like `HomeContent.tsx`) to manage the state.

### Card Component Variants

The `DestinationCard` component supports two variants via props:
- **Paragraph variant**: `description` prop — for excursions and hotels
- **Feature list variant**: `features` prop (string array) — for transfers/vehicles with CheckCircle icons
- **Title sizes**: `titleSize="lg"` (text-4xl, short names) or `titleSize="sm"` (text-3xl leading-snug, long names)
- **Grayscale**: `grayscale="30"` (excursions) or `grayscale="20"` (hotels/vehicles)

### Tab-Linked Content

The SearchWidget tab selection controls BOTH the search form fields AND the DestinationsSection content below. This is managed via shared `activeTab` state in `HomeContent.tsx`.

| Tab | Search Fields | Section Content |
|-----|--------------|----------------|
| Excursions | Destination, Date, Participants | Iconic Destinations |
| Hotels | Destination, Check-in/out, Guests | Top Luxury Hotels |
| Transfers | Pickup, Dropoff, Date, Passengers | Premium Transfer Services |

### Tailwind Conventions

1. **Use Tailwind's `@theme inline` in `src/app/globals.css`** to define design tokens. This is Tailwind v4 — there is NO `tailwind.config.ts` file.
2. **Prefer Tailwind utility classes** over custom CSS. Only use custom CSS for complex gradients/animations (like `.brand-gradient-text`).
3. **Responsive design**: Mobile-first. Use `md:` for tablet/desktop breakpoints.
4. **Spacing consistency**: `px-6` for horizontal page padding, `py-32` for section vertical padding, `max-w-7xl mx-auto` for content width.

### File Organization

```
src/
├── app/
│   ├── layout.tsx             # Root layout (fonts, metadata, theme script)
│   ├── globals.css            # Design tokens + CSS custom properties (source of truth)
│   ├── not-found.tsx          # Global 404 page
│   ├── error.tsx              # Global error boundary
│   ├── page.tsx               # Landing page composition
│   ├── login/                 # Auth pages
│   ├── register/
│   ├── forgot-password/
│   ├── reset-password/
│   ├── hotels/                # Hotel search → room select → book → confirmation
│   │   ├── search/
│   │   │   └── rooms/
│   │   ├── book/
│   │   └── bookings/[id]/confirmation/
│   ├── tours/                 # Tour listing → detail → book → confirmation
│   │   ├── [slug]/
│   │   ├── book/
│   │   └── bookings/[id]/confirmation/
│   ├── transfers/             # Transfer listing → book → confirmation
│   │   ├── book/
│   │   └── bookings/[id]/confirmation/
│   ├── dashboard/             # Protected user area
│   │   ├── bookings/          # All bookings (tabs: hotels/tours/transfers)
│   │   │   ├── hotels/[id]/
│   │   │   ├── tours/[id]/
│   │   │   └── transfers/[id]/
│   │   ├── profile/
│   │   └── notifications/
│   └── [static pages]/        # about, contact, destinations, experiences, journal, etc.
├── components/
│   ├── AkazaLogo.tsx          # Brand logo — always import, never recreate
│   ├── Navbar.tsx             # Sticky glass nav with theme toggle
│   ├── Footer.tsx             # 4-column footer with newsletter
│   ├── HomeContent.tsx        # Client wrapper for tab state
│   ├── SearchWidget.tsx       # Tabbed search form
│   ├── DestinationsSection.tsx
│   ├── DestinationCard.tsx    # 590px image card (paragraph + feature list variants)
│   ├── DashboardLayout.tsx    # Sidebar + content layout for protected pages
│   ├── SubpageHero.tsx        # Reusable editorial hero for subpages
│   ├── Providers.tsx          # AuthProvider + ToastProvider wrapper
│   └── ui/                    # Reusable primitives
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Select.tsx
│       ├── Modal.tsx
│       ├── Badge.tsx
│       ├── Toast.tsx
│       ├── Spinner.tsx
│       ├── Breadcrumb.tsx
│       ├── Pagination.tsx
│       ├── EmptyState.tsx
│       └── index.ts           # Barrel exports
├── lib/
│   ├── api/                   # API client modules
│   │   ├── client.ts          # Base fetch wrapper with auth headers + error handling
│   │   ├── auth.ts            # Login, register, logout, password reset
│   │   ├── hotels.ts          # Search, checkrate, bookings, cancel, voucher
│   │   ├── tours.ts           # List, detail, availabilities, bookings, cancel, voucher
│   │   ├── transfers.ts       # Vehicles, routes, prices, bookings, cancel, voucher
│   │   ├── profile.ts         # Get/update profile
│   │   ├── notifications.ts   # List, mark read, mark all read
│   │   ├── settings.ts        # Public settings
│   │   └── index.ts           # Barrel exports
│   └── auth/                  # Auth infrastructure
│       ├── AuthProvider.tsx   # React context for user state + login/logout
│       ├── ProtectedRoute.tsx # Route guard — redirects to /login if unauthenticated
│       └── index.ts           # Barrel exports
└── types/                     # TypeScript interfaces
    ├── api.ts                 # ApiResponse, PaginatedPayload envelopes
    ├── auth.ts                # User, LoginResponse, RegisterResponse
    ├── hotel.ts               # HotelSearchResult, HotelBooking, CancellationCost
    ├── tour.ts                # Tour, TourBooking, TourAvailability
    ├── transfer.ts            # Vehicle, Route, TransferBooking
    ├── notification.ts        # Notification
    ├── settings.ts            # PublicSetting
    └── index.ts               # Barrel exports
```

### Dashboard Pattern

Protected pages use the `DashboardLayout` component wrapped in `ProtectedRoute`:

```tsx
<ProtectedRoute>
  <Navbar />
  <DashboardLayout>
    <YourPageContent />
  </DashboardLayout>
  <Footer />
</ProtectedRoute>
```

`ProtectedRoute` checks auth state and redirects to `/login` if unauthenticated. `DashboardLayout` provides a sidebar with user card, nav links (bookings, profile, notifications), and logout.

### API Integration (Laravel Backend)

The API client is fully built in `src/lib/api/`. Key patterns:

- **Base client** (`client.ts`): Wraps `fetch()` with auth headers (`Bearer` token from `localStorage`), `Accept-Language` header, and error normalization via `ApiError` class.
- **API URL**: `NEXT_PUBLIC_API_URL` env var, defaults to `http://127.0.0.1:8000/api`.
- **Response envelope**: Backend returns `{ success, payload, errors, status }`. The client unwraps this automatically.
- **Error handling**: Catch `ApiError` in components — it has `.errors` (string array) and `.fieldErrors` (per-field validation).
- **Auth flow**: `AuthProvider` stores token in `localStorage`, passes it via `Authorization` header on every request.
- **Booking flows**: Form page (2/3 form + 1/3 sticky price sidebar) → POST booking → redirect to confirmation page.

### When Adding New Components

1. Check `docs/DESIGN_SYSTEM.md` for the exact styling pattern
2. Check existing components for similar patterns to reuse
3. Make it prop-driven and reusable
4. Export as default from a single file in `src/components/`
5. No rounded corners, use design token colors, correct font family

### Phone Input

All phone fields MUST use the `PhoneInput` component (`src/components/ui/PhoneInput.tsx`), never a plain `<Input type="tel">`. It provides a country picker and outputs E.164 format strings that the backend validates with `phone:INTERNATIONAL`. Default country is `"EG"`. Use `validatePhone()` from `src/lib/validation/phone.ts` for client-side validation before submission.

## Do NOT

- Add new dependencies without explicit approval (especially UI libraries, CSS frameworks, or icon packs)
- Use `rounded-*` classes on any element (except `rounded-full` for decorative circles/pills)
- Hardcode colors as hex values — always use the Tailwind tokens or CSS custom properties
- Create `tailwind.config.ts` — Tailwind v4 uses `@theme inline` in CSS
- Use any icon library other than `lucide-react`
- Use Inter font — the project uses Plus Jakarta Sans
- Add comments that just restate what the code does — only comment WHY, not WHAT
- Create documentation files unless explicitly asked
- Duplicate component logic — extend existing components with props instead
- Put state management in page.tsx — use wrapper components like HomeContent.tsx

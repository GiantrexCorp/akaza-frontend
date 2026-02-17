# Akaza Travel — AI Development Guidelines

## Project Overview

Akaza Travel is a luxury Egypt travel platform. This is the Next.js frontend; a Laravel backend API will be integrated later. The design language is dark, elegant, and editorial — sharp edges, warm gold accents, serif headings, no rounded corners.

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
2. **No rounded corners.** Never use `rounded-*` classes. The entire design uses sharp/square edges. The only exception is `rounded-full` for decorative circles (glows, blurs).
3. **Use design tokens from globals.css.** Never hardcode hex colors — use `text-primary`, `bg-bg-dark`, `bg-primary-gradient-end`, etc.
4. **Serif for headings, sans for body.** Use `font-serif` (Playfair Display) for h1–h4, prices, hero buttons, card titles, input text. Use `font-sans` (Plus Jakarta Sans) for everything else.
5. **Sharp, elegant aesthetic.** When in doubt, look at existing components for the visual pattern.
6. **Image grayscale treatment.** Card images use `grayscale-[30%]` (excursions) or `grayscale-[20%]` (hotels/vehicles). Hover removes grayscale with `group-hover:grayscale-0`.

### Color Tokens (defined in globals.css)

| Token | Hex | Usage |
|-------|-----|-------|
| `primary` | `#b38b59` | Gold accent |
| `primary-dark` | `#8c6b42` | Dark gold pressed |
| `primary-gradient-end` | `#9a7648` | Button gradient end, search hover |
| `accent` | `#d4af37` | Bright gold for gradient text |
| `accent-light` | `#f3e5ab` | Brand gradient text midpoint |
| `secondary` | `#4a5568` | Muted blue-gray |
| `bg-dark` | `#1a1c23` | Main background |
| `bg-darker` | `#111216` | Card overlays |
| `bg-card` | `#23262f` | Elevated surfaces |
| `bg-vip` | `#14161b` | VIP section |
| `bg-footer` | `#0f1014` | Footer |

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
│   ├── layout.tsx          # Root layout — DO NOT modify fonts/metadata without reason
│   ├── globals.css         # Design tokens — the source of truth for colors
│   └── page.tsx            # Landing page composition
├── components/
│   ├── AkazaLogo.tsx       # Brand logo — always import this, never recreate
│   ├── HomeContent.tsx     # Client wrapper for tab state (SearchWidget + DestinationsSection)
│   ├── OfficeSection.tsx   # Map background with contact card
│   └── ui/                 # Future: small primitives (Button, Input, Badge, Card)
├── lib/                    # Future: API client, utilities, helpers
└── types/                  # Future: shared TypeScript types/interfaces
```

### When Adding New Components

1. Check `docs/DESIGN_SYSTEM.md` for the exact styling pattern
2. Check existing components for similar patterns to reuse
3. Make it prop-driven and reusable
4. Export as default from a single file in `src/components/`
5. No rounded corners, use design token colors, correct font family

### Future: API Integration (Laravel Backend)

- API client will live in `src/lib/api/`
- Types/interfaces for API responses in `src/types/`
- Data fetching in server components using `fetch()` or a dedicated client
- Form submissions via server actions or client-side API calls
- Environment variables in `.env.local` (prefixed with `NEXT_PUBLIC_` for client-side)

## Do NOT

- Add new dependencies without explicit approval (especially UI libraries, CSS frameworks, or icon packs)
- Use `rounded-*` classes on any element (except `rounded-full` for decorative circles)
- Hardcode colors as hex values — always use the Tailwind tokens
- Create `tailwind.config.ts` — Tailwind v4 uses `@theme inline` in CSS
- Use any icon library other than `lucide-react`
- Use Inter font — the project uses Plus Jakarta Sans
- Add comments that just restate what the code does — only comment WHY, not WHAT
- Create documentation files unless explicitly asked
- Duplicate component logic — extend existing components with props instead
- Put state management in page.tsx — use wrapper components like HomeContent.tsx

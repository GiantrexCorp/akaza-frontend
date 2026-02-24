# Akaza Travel — Design System

Single source of truth for all design decisions. Every AI tool and developer must follow this document when writing UI code. Derived from the Figma exports in `/docs/figma/`.

## Brand Identity

- **Product**: Akaza Travel — luxury Egypt travel platform
- **Tone**: Dark, elegant, editorial. Think high-end magazine, not SaaS dashboard.
- **Shape language**: Sharp edges only. NO rounded corners (`rounded-*`) on any UI element. The only exception is `rounded-full` for decorative blur circles and pill badges.
- **Motion**: Subtle, slow transitions. Default `transition-all duration-300` or `duration-500`. Never jarring or fast.

## Color Palette

All colors are defined in `src/app/globals.css` via `@theme inline`. Always use the Tailwind token names — never hardcode hex values inline.

### Base Palette (dark theme defaults)

| Token                  | Hex       | Usage                                       |
|------------------------|-----------|---------------------------------------------|
| `primary`              | `#b97532` | Warm gold — buttons, links, highlights, active states |
| `primary-dark`         | `#753f20` | Darker gold — pressed states                |
| `primary-gradient-end` | `#e2af6d` | Button gradient end-stop, search hover      |
| `accent`               | `#346d80` | Teal — brand gradient text highlights       |
| `accent-light`         | `#97b9c1` | Light teal — brand gradient text endpoint   |
| `secondary`            | `#688e99` | Muted teal-gray — brand gradient endpoint   |
| `bg-light`             | `#f4f2f0` | Light mode background                       |
| `bg-dark`              | `#0b171b` | Main page background                        |
| `bg-darker`            | `#060e11` | Card overlays, gradient endpoints           |
| `bg-card`              | `#102127` | Search widget, elevated card surfaces       |
| `bg-vip`               | `#0b1a20` | VIP section, office card background         |
| `bg-footer`            | `#070f12` | Footer background                           |

### CSS Custom Properties (Theme-Aware)

The project uses a dual-layer system. Tailwind `@theme` tokens provide the base palette. CSS custom properties provide semantic values that swap between dark/light themes via `data-theme` attribute.

**Surface tokens** (`--surface-*`):
| Variable | Dark Value | Usage |
|----------|-----------|-------|
| `--surface-page` | `#0b171b` | Main background (`body`) |
| `--surface-nav` | `rgba(11,23,27,0.85)` | Navbar glass background |
| `--surface-card` | `#102127` | Card/elevated surface |
| `--surface-section` | `#0b1a20` | Section backgrounds |
| `--surface-footer` | `#070f12` | Footer background |

**Text tokens** (`--text-*`):
| Variable | Dark Value | Usage |
|----------|-----------|-------|
| `--text-primary` | `#ffffff` | Primary headings, important text |
| `--text-secondary` | `#d7dee7` | Body text, descriptions |
| `--text-muted` | `#94a3b8` | Muted labels, captions |

**Line tokens** (`--line-*`):
| Variable | Dark Value | Usage |
|----------|-----------|-------|
| `--line-soft` | `rgba(255,255,255,0.08)` | Subtle dividers, card borders |
| `--line-strong` | `rgba(255,255,255,0.24)` | Visible borders, button outlines |

**Field tokens** (`--field-*`):
| Variable | Dark Value | Usage |
|----------|-----------|-------|
| `--field-text` | `#d7dee7` | Input text color |
| `--field-placeholder` | `rgba(215,222,231,0.46)` | Placeholder text |

**Component-specific tokens**: `--hero-*`, `--search-widget-*`, `--destinations-*`, `--experiences-*`, `--contact-*` — see `globals.css` for full list.

### Border Colors

| Class              | Usage                                       |
|--------------------|---------------------------------------------|
| `border-[var(--line-soft)]` | Subtle dividers (cards, sections, nav) |
| `border-[var(--line-strong)]` | Visible borders, button outlines |
| `border-primary`   | Active tab indicator, search widget top border |
| `border-primary/40`| Badge borders                               |
| `border-primary/50`| Hover state card frames                     |

### Special CSS Classes

```css
.brand-gradient-text {
  background: linear-gradient(90deg, #b97532, #e2af6d, #97b9c1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  background-size: 200% auto;
}
```
Use for gold-to-teal shimmer text effects on special headings. Defined in `globals.css`. Light theme version uses different gradient stops.

## Typography

### Font Families

| Token       | Font                | Usage                                      |
|-------------|---------------------|--------------------------------------------|
| `font-serif`| Playfair Display    | All headings (h1-h4), prices, hero buttons, card titles, input text |
| `font-sans` | Plus Jakarta Sans   | Body text, nav links, labels, descriptions, UI buttons |

### Typography Patterns

| Element                    | Classes                                                        |
|----------------------------|----------------------------------------------------------------|
| Hero heading               | `text-5xl md:text-8xl font-serif text-white tracking-wide leading-tight drop-shadow-2xl` |
| Hero badge                 | `text-xs font-serif italic tracking-wider text-primary`        |
| Hero subtitle              | `text-lg md:text-xl text-slate-200 font-light leading-relaxed tracking-wide font-sans` |
| Section label              | `text-primary font-bold uppercase tracking-[0.3em] text-xs font-sans` |
| Section label (wide)       | `text-primary font-bold uppercase tracking-[0.4em] text-xs font-sans` (VIP section) |
| Section heading            | `text-4xl md:text-6xl font-serif text-white leading-none`     |
| Section subheading (muted) | `italic text-slate-500` (nested in h3)                        |
| VIP heading                | `text-4xl md:text-7xl font-serif text-white tracking-tight`   |
| Card title (short names)   | `text-4xl font-serif text-white italic` (e.g. "Hurghada")     |
| Card title (long names)    | `text-3xl font-serif text-white italic leading-snug` (e.g. "Four Seasons Resort") |
| Card category label        | `text-primary text-[10px] font-bold uppercase tracking-[0.3em] font-sans` |
| Card description           | `text-slate-300 text-sm font-light leading-relaxed font-sans line-clamp-2` |
| Card feature list item     | `text-slate-300 text-sm font-light leading-relaxed font-sans` with CheckCircle icon |
| Card price                 | `text-white font-serif text-lg`                               |
| Service card title         | `text-2xl font-serif text-white italic`                       |
| Service card description   | `text-slate-500 text-sm leading-relaxed tracking-wide font-sans` |
| Nav links                  | `text-slate-300 uppercase tracking-wider text-xs font-medium` |
| Button (nav CTA)           | `uppercase tracking-widest text-xs font-bold font-sans`       |
| Button (hero)              | `font-serif text-lg tracking-wide`                            |
| Button (section CTA)       | `uppercase tracking-widest text-xs font-bold`                 |
| Form label                 | `text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]` |
| Input text                 | `text-lg font-serif text-white`                               |
| Footer link                | `text-slate-500 text-sm font-light`                           |
| Footer column heading      | `text-white font-bold uppercase tracking-[0.2em] text-xs`     |
| Copyright                  | `text-slate-600 text-[10px] tracking-wider uppercase`         |

## Component Patterns

### Buttons

```
Nav CTA:        bg-gradient-to-r from-primary to-primary-gradient-end hover:to-primary text-white px-8 py-3 uppercase tracking-widest text-xs font-bold shadow-lg
Hero primary:   bg-primary hover:bg-white hover:text-bg-dark text-white px-10 py-4 font-serif text-lg tracking-wide min-w-[200px]
Hero outline:   border border-white/40 bg-white/5 backdrop-blur-md text-white px-10 py-4 font-serif text-lg tracking-wide min-w-[200px]
Section CTA:    border border-primary text-primary hover:bg-primary hover:text-white px-12 py-5 uppercase tracking-widest text-xs font-bold
Search button:  bg-primary hover:bg-primary-gradient-end text-white h-[56px] uppercase tracking-widest text-xs font-bold shadow-lg
Subscribe:      bg-white text-black hover:bg-primary hover:text-white py-3 uppercase tracking-widest text-xs font-bold
```

**CRITICAL**: No `rounded-*` classes on buttons. All buttons are sharp/square.

### Cards — Destination / Hotel / Vehicle (590px)

Full-height image cards used in the featured section. Two content variants:

**Paragraph variant** (excursions, hotels):
- `h-[590px]` container, absolute positioned image with gradient overlay
- Hover: inner border frame (`m-3 border border-primary/50`), image `scale-105`, grayscale lifts to 0
- Content at bottom: category label -> title (italic serif) -> gold divider -> description -> price + arrow
- Excursion cards: `grayscale-[30%]`, `text-4xl` titles
- Hotel cards: `grayscale-[20%]`, `text-3xl leading-snug` titles

**Feature list variant** (transfers/vehicles):
- Same layout but description replaced with `<ul>` of features, each with `CheckCircle` icon
- `grayscale-[20%]`, `text-3xl leading-snug` titles
- Price prefix: "starting from" instead of "from"

### Cards — Service (VIP section)

Square cards, centered content:
```
p-10 border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-500
```
- Icon: `size={48} strokeWidth={1}`, `text-primary group-hover:text-white`
- Title: `text-2xl font-serif text-white italic`
- Description: `text-slate-500 text-sm leading-relaxed tracking-wide font-sans`

### Inputs

Underline style — transparent background, bottom border only:
```
bg-transparent border-b border-slate-700 focus:border-primary text-white placeholder-slate-500 text-lg font-serif outline-none
```
Each input has an icon positioned with `absolute left-0 top-1/2 -translate-y-1/2 text-primary`.

### Glass / Frosted Surfaces

- Navbar: `bg-[var(--surface-nav)] backdrop-blur-2xl border-b border-[var(--line-soft)]`
- Hero badge: `bg-black/20 backdrop-blur-sm border border-primary/40`
- Office card: `bg-bg-vip/95 backdrop-blur-xl border border-white/10`

### Decorative Elements

- VIP section glow: `absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-b from-primary/5 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2`
- Gold divider (cards): `w-12 h-[1px] bg-primary`
- Gold divider (VIP header): `w-24 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent`

### Section Spacing

- Between sections: `py-32`
- Max content width: `max-w-7xl mx-auto px-6`
- Section header to content: `mb-20`
- Search widget max-width: `max-w-6xl mx-auto px-6`

## Page Patterns

### Booking Flow (Hotels, Tours, Transfers)

All three booking flows follow the same layout:
- **Form area** (2/3 width): Guest details, contact info, special requests
- **Sticky sidebar** (1/3 width): Price summary, booking details, submit button
- Grid: `grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8`
- After submission: redirect to `/[type]/bookings/[id]/confirmation`

### Dashboard Pages

Protected pages use `DashboardLayout` + `ProtectedRoute`:
- Sidebar: user card + nav links (bookings, profile, notifications) + logout
- Content area: booking lists, booking detail with cancel/voucher actions
- Grid: `grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8`

### Editorial/Static Pages

Subpages (about, how-we-work, concierge-services, etc.) use `SubpageHero` for the hero section, then editorial content sections with reveal animations via `IntersectionObserver`.

### Auth Pages

Login/register pages use a centered card layout with the form fields styled to match the design system. Wrapped in `Navbar` + `Footer`.

## Page Architecture — Tab-Linked Sections

The SearchWidget and DestinationsSection are linked via shared state. When a user clicks a tab (Hotels / Excursions / Transfers), both the search form fields AND the card section below update:

| Tab        | Section Label        | Section Heading                          | Cards      |
|------------|---------------------|------------------------------------------|------------|
| Excursions | Curated Experiences | Iconic Destinations / Told Through Luxury| 3 destinations |
| Hotels     | Curated Stays       | Top Luxury Hotels / Unmatched Elegance   | 3 hotels   |
| Transfers  | Executive Fleet     | Premium Transfer Services / Seamless Travel| 3 vehicles |

State is managed in `HomeContent.tsx` (client component) which wraps both SearchWidget and DestinationsSection.

## Logo

The Akaza logo is an SVG pyramid icon + "AKAZA" text + "Travel" subtext. Implemented in `src/components/AkazaLogo.tsx`. Always import and use this component — never recreate inline (except in Footer where layout differs).

```
SVG path: M12 2L2 22H7L12 12L17 22H22L12 2ZM12 5.8L15.1 12H8.9L12 5.8Z
```

## Icons

- Use `lucide-react` exclusively. Never use Material Icons, Heroicons, or Font Awesome.
- Icon sizes: 12px (footer inline), 14px (card features), 16px (small/inline), 20px (inputs/tabs), 24px (navigation), 48px (service cards with `strokeWidth={1}`).

## Images

All images are stored in `/public/images/`. The hero background is at `/public/hero-pyramids.png`.

| File                      | Usage                    |
|---------------------------|--------------------------|
| `hero-pyramids.png`       | Hero background (via Next.js `<Image>` with `fill`, `priority`) |
| `hurghada.jpg`            | Excursions card 1        |
| `marsa-alam.jpg`          | Excursions card 2        |
| `cairo.jpg`               | Excursions card 3        |
| `hotel-four-seasons.jpg`  | Hotels card 1            |
| `hotel-marriott.jpg`      | Hotels card 2            |
| `hotel-steigenberger.jpg` | Hotels card 3            |
| `vehicle-limousine.jpg`   | Transfers card 1         |
| `vehicle-suv.jpg`         | Transfers card 2         |
| `vehicle-van.jpg`         | Transfers card 3         |
| `map-egypt.jpg`           | Office section background|

Card images use `<img>` tags (for absolute positioning inside cards). Always include meaningful `alt` text. Images have grayscale filter that lifts on hover.

## Contact Information

- **Office**: El Kawthar District, Hurghada, Egypt
- **Phone**: +20 123 456 789
- **Email**: info@akaza-travel.com

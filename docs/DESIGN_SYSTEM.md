# Akaza Travel — Design System

Single source of truth for all design decisions. Every AI tool and developer must follow this document when writing UI code. Derived from the Figma exports in `/docs/figma/`.

## Brand Identity

- **Product**: Akaza Travel — luxury Egypt travel platform
- **Tone**: Dark, elegant, editorial. Think high-end magazine, not SaaS dashboard.
- **Shape language**: Sharp edges only. NO rounded corners (`rounded-*`) on any UI element. The only exception is `rounded-full` for decorative blur circles.
- **Motion**: Subtle, slow transitions. Default `transition-all duration-300` or `duration-500`. Never jarring or fast.

## Color Palette

All colors are defined in `src/app/globals.css` via `@theme inline`. Always use the Tailwind token names — never hardcode hex values inline.

| Token                  | Hex       | Usage                                       |
|------------------------|-----------|---------------------------------------------|
| `primary`              | `#b38b59` | Warm gold — buttons, links, highlights, active states |
| `primary-dark`         | `#8c6b42` | Darker gold — pressed states                |
| `primary-gradient-end` | `#9a7648` | Book Now button gradient end-stop, search hover |
| `accent`               | `#d4af37` | Bright gold — gradient text highlights      |
| `accent-light`         | `#f3e5ab` | Light gold — brand gradient text midpoint   |
| `secondary`            | `#4a5568` | Muted blue-gray — brand gradient endpoint   |
| `bg-light`             | `#f5f3f0` | Light mode background (future use)          |
| `bg-dark`              | `#1a1c23` | Main page background                        |
| `bg-darker`            | `#111216` | Card overlays, gradient endpoints           |
| `bg-card`              | `#23262f` | Search widget, elevated card surfaces       |
| `bg-vip`               | `#14161b` | VIP section, office card background         |
| `bg-footer`            | `#0f1014` | Footer background                           |

### Text Colors (from Tailwind's slate palette)

| Class              | Usage                                       |
|--------------------|---------------------------------------------|
| `text-white`       | Primary headings, important text            |
| `text-slate-200`   | Body text, hero subtitles                   |
| `text-slate-300`   | Nav links, card descriptions, secondary text|
| `text-slate-400`   | Form labels, muted descriptions, VIP body   |
| `text-slate-500`   | Footer text, service card descriptions      |
| `text-slate-600`   | Copyright text, very muted                  |
| `text-primary`     | Gold accent text, category labels, active tabs |

### Border Colors

| Class              | Usage                                       |
|--------------------|---------------------------------------------|
| `border-white/5`   | Subtle dividers (nav, footer, cards, tab sidebar) |
| `border-white/10`  | Office card border                          |
| `border-white/30`  | Card action buttons (arrow buttons)         |
| `border-white/40`  | Hero outline button                         |
| `border-primary`   | Active tab indicator, search widget top border |
| `border-primary/40`| Hero badge border                           |
| `border-primary/50`| Hover state card frames                     |
| `border-slate-700` | Input underlines                            |
| `border-slate-800` | Section dividers, footer social icons       |

### Special CSS Classes

```css
.brand-gradient-text {
  background: linear-gradient(90deg, #d4af37, #f3e5ab, #d4af37);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-size: 200% auto;
}
```
Use for gold shimmer text effects on special headings. Defined in `globals.css`.

## Typography

### Font Families

| Token       | Font                | Usage                                      |
|-------------|---------------------|--------------------------------------------|
| `font-serif`| Playfair Display    | All headings (h1–h4), prices, hero buttons, card titles, input text |
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

### Cards — Destination / Hotel / Vehicle (550px)

Full-height image cards used in the featured section. Two content variants:

**Paragraph variant** (excursions, hotels):
- `h-[550px]` container, absolute positioned image with gradient overlay
- Hover: inner border frame (`m-4 border-2 border-primary/50`), image `scale-105`, grayscale lifts to 0
- Content at bottom: category label → title (italic serif) → gold divider → description → price + arrow
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

- Navbar: `bg-bg-dark/85 backdrop-blur-[16px] border-b border-white/5`
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

## File Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout (fonts, metadata)
│   ├── globals.css         # Design tokens (@theme inline), base styles, .brand-gradient-text
│   └── page.tsx            # Page composition (thin — imports + assembles components)
│   └── [feature]/          # Future pages (e.g., /destinations, /booking)
│       └── page.tsx
├── components/
│   ├── AkazaLogo.tsx       # Brand logo component
│   ├── Navbar.tsx           # Sticky glass nav
│   ├── Hero.tsx             # Full-viewport hero with background image
│   ├── HomeContent.tsx      # Client wrapper — manages shared tab state
│   ├── SearchWidget.tsx     # Tabbed search form (controlled by parent)
│   ├── DestinationsSection.tsx # Tab-linked card section with all 3 datasets
│   ├── DestinationCard.tsx  # 550px image card (paragraph + feature list variants)
│   ├── VIPServices.tsx      # VIP section with 3 service cards
│   ├── ServiceCard.tsx      # Centered icon + title + description card
│   ├── OfficeSection.tsx    # Map background with office contact card
│   ├── Footer.tsx           # 4-column footer with newsletter
│   └── ui/                  # Future: small reusable primitives (Button, Input, Badge)
├── lib/                     # Future: API client, utilities, helpers
└── types/                   # Future: shared TypeScript interfaces
```

## Contact Information

- **Office**: El Kawthar District, Hurghada, Egypt
- **Phone**: +20 123 456 789
- **Email**: info@akaza-travel.com

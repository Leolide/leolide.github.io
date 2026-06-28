# RFC: Next.js + shadcn/ui Portfolio Overhaul

**Status:** Draft  
**Author:** Lide Li  
**Date:** 2026-06-28  

---

## Background

The current site is a Webflow export enhanced with custom CSS and vanilla JS. It works, but the architecture has accumulated friction:

- ~16 CSS files, many with `!important` wars against Webflow's base styles
- jQuery loaded for Webflow interactions that aren't used
- Poppins loaded via Google Fonts even though Satoshi is the actual font
- Content managed via CSV + client-side JS parsing — fragile and hard to debug
- Routing is URL parameter hacks (`?project=tofu`) rather than real routes
- No component abstraction — the same button structure is copy-pasted 6+ times in `index.html` with inline SVG brackets

The site reads as a Webflow export with overrides, not as a purposefully designed system.

---

## Motivation

1. **Maintainability** — one CSS system (Tailwind) instead of Webflow base + 16 override files
2. **Design consistency** — shadcn/ui's token system maps cleanly to the Linear DESIGN.md tokens already in the repo
3. **Real routing** — project detail pages become `/work/autopilot` not `?project=autopilot`
4. **Omnibar** — shadcn's `Command` component is a drop-in for the custom `omnibar.js` (⌘K search)
5. **Static export** — Next.js `output: 'export'` keeps GitHub Pages compatibility, zero hosting change

---

## Proposed Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js 15 (App Router) | Static export + file-based routing |
| Components | shadcn/ui | Headless, composable, Tailwind-native |
| Styling | Tailwind CSS v4 | Replaces all 16 CSS files |
| Animation | Framer Motion | Replaces GSAP + custom stacked-works.js |
| Font | Satoshi (self-hosted, already in `/fonts/`) | No change |
| 3D | Spline viewer (kept as-is) | Web component, works in React |
| Content | JSON flat files | Replaces CSV + csv-content-loader.js |
| TypeScript | Yes | Catches prop mismatches early |

---

## Design Token Mapping

The `DESIGN.md` in this repo documents Linear's token system. The overhaul maps those directly into the Tailwind theme:

```js
// tailwind.config.ts (excerpt)
theme: {
  extend: {
    colors: {
      canvas:    '#010102',
      surface:   { 1: '#0f1011', 2: '#141516', 3: '#18191a' },
      ink:       { DEFAULT: '#f7f8f8', muted: '#d0d6e0', subtle: '#8a8f98' },
      hairline:  { DEFAULT: '#23252a', strong: '#34343a' },
      accent:    { DEFAULT: '#5e6ad2', hover: '#828fff' },
    },
    fontFamily: {
      sans: ['Satoshi', 'system-ui', 'sans-serif'],
    },
    letterSpacing: {
      display: '-0.04em',   // hero headline
      heading: '-0.025em',  // section headings
      body:    '-0.005em',  // body copy
    },
    fontSize: {
      'display-xl': ['68px', { lineHeight: '1.05', letterSpacing: '-0.04em' }],
      'display-lg': ['48px', { lineHeight: '1.10', letterSpacing: '-0.025em' }],
      'display-md': ['32px', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
      'headline':   ['22px', { lineHeight: '1.25', letterSpacing: '-0.015em' }],
      'body-lg':    ['18px', { lineHeight: '1.50' }],
      'body':       ['16px', { lineHeight: '1.50' }],
      'body-sm':    ['14px', { lineHeight: '1.50' }],
      'caption':    ['12px', { lineHeight: '1.40' }],
      'eyebrow':    ['13px', { lineHeight: '1.30', letterSpacing: '0.04em' }],
    },
    borderRadius: {
      xs:   '4px',
      sm:   '6px',
      md:   '8px',
      lg:   '12px',
      xl:   '16px',
      pill: '9999px',
    },
  }
}
```

---

## Page Inventory

| Current | New route | Notes |
|---|---|---|
| `index.html` | `/` (app/page.tsx) | Hero, Selected Works, About/Timeline, Footer |
| `work.html` | `/work` | Portfolio grid, loaded from JSON |
| `about.html` | `/about` | Merge into homepage or keep as separate route |
| `fun.html` | `/fun` | Experiments pinboard/canvas |
| `detail_works-with-code.html?project=X` | `/work/[slug]` | Dynamic route per project |
| `password-protection.html` | Next.js middleware | Route-level password gate |

---

## Component Inventory

### shadcn/ui components used directly

| shadcn component | Used for |
|---|---|
| `Button` | All CTAs — replaces the SVG bracket button mess |
| `Badge` | Work card tags |
| `Command` | Omnibar (⌘K) — replaces custom omnibar.js entirely |
| `Separator` | Section dividers |
| `Tooltip` | Social icon labels |

### Custom components to build

| Component | Description |
|---|---|
| `<Navbar>` | Logo left, segmented nav right, search icon triggers Command |
| `<Hero>` | 68px headline, Satoshi 600, Spline viewer right |
| `<WorkCard>` | Image, accent line, date, title, desc, tags. Replaces sw-card |
| `<StackedWorks>` | Sticky scroll stack — Framer Motion replaces stacked-works.js |
| `<TimelineItem>` | Experience row: icon, date, title, role |
| `<Footer>` | Email CTA primary, social icons secondary |
| `<PasswordGate>` | Middleware-based, replaces password-protection.js |

---

## What Gets Deleted

- All 16 CSS files in `/css/` — replaced by Tailwind utilities
- `js/csv-content-loader.js` — content moves to JSON
- `js/project-router.js` — replaced by Next.js dynamic routes
- `js/url-router.js` — replaced by Next.js router
- `js/omnibar.js` — replaced by shadcn `Command`
- `js/stacked-works.js` — replaced by Framer Motion
- `js/spa-nav.js` — replaced by Next.js `<Link>`
- `js/password-protection.js` — replaced by Next.js middleware
- jQuery (`jquery-3.5.1.min.js`) — not needed
- Webflow JS (`js/webflow.js`) — not needed
- Google WebFont loader for Poppins — Satoshi already self-hosted

What stays: `/fonts/Satoshi-*.woff2`, `/images/`, `/videos/`, `CNAME`, `.nojekyll`

---

## Content Migration

CSV → JSON flat files in `/content/`:

```
/content/
  works.json          # portfolio projects (was Lide's Portfolio - Works.csv)
  works-pro.json      # professional projects (was Works_with_Codes.csv)
```

Each project entry:
```json
{
  "slug": "autopilot",
  "title": "Autopilot — Control Center for Agentic Workflows",
  "date": "2025 MAY – Present",
  "description": "...",
  "tags": ["0 → 1", "Agentic Workflow", "Observability"],
  "accent": "70,185,130",
  "image": "/images/autopilot-screenshot.webp",
  "url": "https://www.palantir.com/docs/foundry/autopilot/overview",
  "protected": false
}
```

---

## GitHub Pages Compatibility

```js
// next.config.ts
const nextConfig = {
  output: 'export',        // static HTML export
  trailingSlash: true,     // GitHub Pages needs index.html per dir
  images: { unoptimized: true }, // no image server on static hosting
}
```

Deploy stays identical: `git push origin main` triggers `.github/workflows/static.yml`.

---

## Migration Strategy

Phase 1 — **Foundation** (this session or next)
- Scaffold Next.js app alongside current site in `/next-app/`
- Wire Tailwind with design tokens above
- shadcn init, add Button, Badge, Command
- Port Satoshi font setup

Phase 2 — **Homepage**
- Build Navbar, Hero, StackedWorks, TimelineItem, Footer
- Port index.html content into components
- Validate Spline viewer works in React

Phase 3 — **Work pages**
- Migrate CSV → works.json
- Build WorkCard, portfolio grid
- Dynamic `/work/[slug]` route
- Password gate middleware

Phase 4 — **Fun & About**
- Port fun.html canvas/pinboard
- Port about.html if kept separate

Phase 5 — **Cut over**
- Move Next.js export to repo root
- Delete old HTML/CSS/JS
- Verify GitHub Pages still deploys

---

## Open Questions

1. **Fun page** — the canvas/pinboard JS is the most bespoke part of the site. React port or keep as an iframe/island?
2. **Spline in production** — does the Spline viewer web component conflict with Next.js hydration? Needs a `dynamic(() => import(...), { ssr: false })` wrapper.
3. **Password protection** — Next.js middleware runs at the edge; GitHub Pages doesn't support it. Options: client-side check (current approach, keep it), or Cloudflare Workers in front of GitHub Pages.
4. **Accent colors per card** — currently inline `--accent: r,g,b` CSS vars. In React this becomes a prop. Worth keeping the per-card accent or consolidate to one brand accent?

---

## Non-Goals

- No CMS (Sanity, Contentful, etc.) — JSON files are sufficient for a portfolio
- No server-side rendering — static export only
- No visual identity change — Satoshi, dark canvas, same content hierarchy
- No new features — this is a port, not a redesign

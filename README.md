# Lumina Café

> Coffee, slow as the tide.

A scroll-driven marketing site for **Lumina Café**, a small-batch beach café on the Palm Cove shore. Built with Next.js 16, Tailwind CSS 4 and GSAP.

## Features

- **Pinned hero:** an iced latte in front of a giant "COFFEE" wordmark. Scrolling blows the ice cubes away, rolls the word to "MATCHA", swaps in an iced matcha with leaves bursting out and tints the page.
- **Scroll-scrubbed video:** a full-bleed pour shot whose playhead follows the scrollbar.
- **Vintage menu book (`/menu`):** a pinned book on aged paper. Scrolling opens the cover, then turns one page per category (Coffee, Cold Brew, Tea & Matcha, Smoothies, Pastries).
- **Reservations and newsletter:** forms validated with Zod on the server, with a honeypot field against bots and toast feedback.
- **Polish:** Lenis smooth scrolling, a coffee-ripple cursor, film grain, scroll reveals, and Open Graph image generation.
- **Accessibility:** a skip-to-content link, `prefers-reduced-motion` support and semantic headings.

## Tech stack

| Area | Tools |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org) (App Router, Turbopack, Cache Components), React 19 |
| Styling | Tailwind CSS 4, `tw-animate-css`, Fraunces + Geist via `next/font` |
| Motion | GSAP + ScrollTrigger (`@gsap/react`), Lenis |
| UI | shadcn / Base UI primitives, `lucide-react`, Sonner toasts |
| Validation | Zod 4 |

## Getting started

Requirements: **Node.js 20.9+** and npm.

```bash
git clone https://github.com/VenomDevX/Lumina-Cafe.git
cd Lumina-Cafe
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server on port 3000 |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

### Sharing the dev server

`next.config.ts` allows `*.trycloudflare.com` origins, so you can share a running dev server with:

```bash
cloudflared tunnel --url http://localhost:3000
```

## Project structure

```
app/
  page.tsx               Home: hero → story → scroll video → signature → experience → testimonials → visit
  menu/page.tsx          Menu book
  api/reserve/route.ts   POST: table reservation
  api/newsletter/route.ts POST: newsletter signup
  layout.tsx             Fonts, metadata, smooth scroll, cursor, toaster
  opengraph-image.tsx    Generated social card
components/
  sections/              Home page sections
  menu-book.tsx          Pinned page-turning menu
  ui/                    Button, Sheet, Tabs, Toaster primitives
lib/
  menu.ts                Menu items, prices, categories (edit the menu here)
  forms.ts               Shared JSON form submit + toasts
  gsap.ts                GSAP plugin registration
  sprites.ts, leaves.ts  Ice, bean and leaf sprite layouts for the hero
public/
  images/                Product photos and sprite cut-outs
  video/                 Scroll video and poster
```

## API

Both endpoints accept JSON and return `{ ok: true }`, or `400` with `{ ok: false, errors: { field: [message] } }`.

**`POST /api/reserve`**

| Field | Rules |
| --- | --- |
| `name` | 2–80 characters |
| `email` | valid email |
| `date` | ISO date (`YYYY-MM-DD`), today or later |
| `time` | `HH:MM`, 24-hour |
| `guests` | 1–12 |
| `notes` | optional, up to 500 characters |

**`POST /api/newsletter`** takes `email` (valid email).

> Submissions are currently only logged (without personal data) and not stored. Connect a database or email provider before taking real bookings.

## Deployment

The site deploys to [Vercel](https://vercel.com) with no extra configuration. Import the repo and deploy. `metadataBase` picks up `VERCEL_PROJECT_PRODUCTION_URL` automatically for absolute Open Graph URLs.

No environment variables are required.

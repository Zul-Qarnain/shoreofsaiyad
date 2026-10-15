# Shore of Saiyad

E-commerce storefront for **Shore of Saiyad** — premium ornaments, accessories and gifts with home delivery across Bangladesh. Built with Next.js 15 (App Router), TypeScript, Tailwind CSS and shadcn/ui.

## Features

| Area | What it does |
| --- | --- |
| **Storefront** | Hero, perks, featured products, category chips, responsive 2→4 column grid |
| **Shop** | Text search, category filter, sort (featured / price / name), in-stock filter — all URL-driven (`/shop?q=mug&category=Gifts&sort=price-asc&inStock=1`), so results are shareable and server-rendered |
| **Product page** | Static generation per product, quantity stepper clamped to stock, *Add to Cart* / *Buy Now*, sale & low-stock badges, reviews with helpful votes, related products, JSON-LD `Product` schema for SEO |
| **Cart** | Left-side drawer, persisted in `localStorage`, re-synced with the catalog on load (stale prices/removed items are corrected), stock limits enforced everywhere |
| **Guest checkout** | Validated form (zod + react-hook-form, Bangladeshi mobile-number validation), delivery zones (Inside Dhaka ৳70 / Sub Dhaka ৳100 / Outside Dhaka ৳130), payment via **Cash on Delivery** (delivery charge paid in advance, per the Terms) or **full bKash/Nagad payment**, transaction-ID capture, live pay-now / due-on-delivery breakdown |
| **Invoice** | Unique order ID (`SOS-YYMMDD-XXXXXX`), real order data, paid vs. due amounts, multi-page PDF download (libraries lazy-loaded), print stylesheet |
| **Admin** (`/admin`) | Password-protected (middleware + server-side checks), inventory overview with low-stock/sold-out stats, **AI product-description generator** (Genkit + Gemini) |
| **Content** | About, Contact (validated, opens the visitor's email client), Terms & Conditions, Return Policy |
| **Platform** | Per-page metadata/Open Graph, `sitemap.xml`, `robots.txt`, custom 404 and error boundary, security headers, skip-to-content link, accessible labels |

## Quick start

```bash
npm ci
cp .env.example .env.local   # then edit values
npm run dev                  # http://localhost:9002
```

Requires Node.js ≥ 20.

### Environment variables

See [`.env.example`](.env.example). Highlights:

- `NEXT_PUBLIC_BKASH_NUMBER`, `NEXT_PUBLIC_NAGAD_NUMBER` — wallet numbers shown at checkout. **Set these before launch.**
- `NEXT_PUBLIC_SUPPORT_EMAIL`, `NEXT_PUBLIC_SUPPORT_PHONE`, `NEXT_PUBLIC_SITE_URL`
- `ADMIN_PASSWORD` — enables `/admin`. Empty = admin disabled.
- `GEMINI_API_KEY` — enables the AI description tool.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Dev server (Turbopack, port 9002) |
| `npm run build` / `npm start` | Production build / serve (build fails on type errors) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Unit tests (Vitest) — cart, checkout pricing/validation, catalog filtering, admin auth |
| `npm run test:e2e` | End-to-end tests (Playwright, desktop + mobile) against a production build — run `npm run build` first |
| `npm run check` | Typecheck + unit tests |
| `npm run genkit:dev` | Genkit developer UI for the AI flow |

CI (`.github/workflows/ci.yml`) runs typecheck, unit tests, build and E2E on every push/PR.

## Project structure

```
src/
  app/
    (store)/            # public pages sharing header/footer: home, shop, products/[id],
                        # checkout, invoice/[id], about, contact, terms, returns
    admin/              # dashboard, login, server actions
    sitemap.ts robots.ts not-found.tsx layout.tsx globals.css
  components/           # header, footer, cart, product card, checkout form, invoice view, ...
    ui/                 # shadcn/ui primitives
  lib/
    products.ts         # catalog + search/filter/sort (single source of truth)
    cart.ts             # pure cart operations
    checkout.ts         # delivery zones, validation schema, totals, order builder
    orders.ts           # order persistence (localStorage)
    admin-auth.ts       # admin session token helpers
    site.ts             # store config from env
  providers/cart-provider.tsx
  ai/                   # Genkit setup + product-description flow
  middleware.ts         # protects /admin
tests/
  unit/                 # Vitest
  e2e/                  # Playwright
```

## Managing products

Products live in [`src/lib/products.ts`](src/lib/products.ts). Each has `id`, `name`, `price`, optional `compareAtPrice` (shows a *Sale* badge), `imageUrl`, `description`, `stock` (0 = sold out, ≤5 = "Only N left"), `category`, `material`, `care`, `featured`. Categories are derived automatically.

Images currently use `picsum.photos` placeholders. Replace them with real product photos (put files in `public/products/` and use `/products/<file>.jpg`, or add your image host to `images.remotePatterns` in `next.config.ts`).

## Deployment

Configured for **Firebase App Hosting** (`apphosting.yaml`); any Node host or Vercel also works:

```bash
npm run build && npm start
```

Set the environment variables in your hosting provider. Increase `maxInstances` in `apphosting.yaml` for more traffic.

## Known limitations / roadmap

This release is a fully working storefront **without a backend database**. Be aware before going live:

- **Orders are stored only in the customer's browser** (`localStorage`). The store owner is *not* notified automatically; the customer's invoice is the record. Before taking real orders, connect a backend — e.g. a Next.js server action writing to Firestore (the `firebase` SDK is already a dependency) — and send an email/SMS notification. `src/lib/orders.ts` and `buildOrder()` in `src/lib/checkout.ts` are the integration points.
- **Payments are verified manually** by matching the bKash/Nagad transaction ID. Automated verification needs the bKash/Nagad merchant APIs.
- **Stock is not decremented** after an order (no shared state). Update `products.ts` manually, or move the catalog to a database.
- **Contact form** opens the visitor's email client (no mail backend). Swap in a server action + email provider (Resend, SendGrid, …) when available.
- **Reviews** are static seed data; votes are per-visitor UI state only.
- **Admin** is single-password; product/order management from the UI requires the database above.

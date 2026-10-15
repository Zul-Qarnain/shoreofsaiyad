# Shore of Saiyad

E-commerce storefront for **Shore of Saiyad** — premium ornaments, accessories and gifts with home delivery across Bangladesh. Built with Next.js 15 (App Router), TypeScript, Tailwind CSS and shadcn/ui.

## Features

| Area | What it does |
| --- | --- |
| **Storefront** | Hero, perks, featured products, category chips, responsive 2→4 column grid |
| **Shop** | Text search, category filter, sort (featured / price / name), in-stock filter — all URL-driven (`/shop?q=mug&category=Gifts&sort=price-asc&inStock=1`), so results are shareable and server-rendered |
| **Product page** | Live stock per request, quantity stepper clamped to stock, *Add to Cart* / *Buy Now*, sale & low-stock badges, reviews with helpful votes, related products, JSON-LD `Product` schema for SEO |
| **Cart** | Left-side drawer, persisted in `localStorage`, re-synced with the catalog and live server stock on load, stock limits enforced everywhere |
| **Guest checkout** | Validated form (zod + react-hook-form, Bangladeshi mobile-number validation), delivery zones (Inside Dhaka ৳70 / Sub Dhaka ৳100 / Outside Dhaka ৳130), payment via **Cash on Delivery** (delivery charge paid in advance, per the Terms) or **full bKash/Nagad payment**, transaction-ID capture, live pay-now / due-on-delivery breakdown. Orders are placed via a server action that **re-prices from the catalog** (client prices are never trusted) and **atomically deducts stock** (no overselling) |
| **Invoice** | Unguessable order ID (`SOS-YYMMDD-XXXXXXXX`), served from the server (works on any device), paid vs. due amounts, multi-page PDF download (libraries lazy-loaded), print stylesheet |
| **Admin** (`/admin`) | Password-protected (middleware + server-side checks). **Orders** (customer, items, TrxID, paid/due) with status workflow Pending → Confirmed → Shipped → Delivered, or Cancelled (returns items to stock); **contact-form inbox**; live inventory with low-stock/sold-out stats; **AI product-description generator** (Genkit + Gemini) |
| **Content** | About, Contact (validated, delivered to the admin inbox), Terms & Conditions, Return Policy |
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
    actions.ts          # public server actions: place order, stock levels, contact
    admin/              # dashboard, login, admin server actions
    sitemap.ts robots.ts not-found.tsx layout.tsx globals.css
  components/           # header, footer, cart, product card, checkout form, invoice view, ...
    ui/                 # shadcn/ui primitives
  lib/
    products.ts         # catalog + search/filter/sort (single source of truth)
    cart.ts             # pure cart operations
    checkout.ts         # delivery zones, validation schema, totals, order builder
    inventory.ts        # pure stock reservation/release + order status rules
    contact.ts          # contact-form schema
    server/db.ts        # file-backed store ($DATA_DIR/store.json), serialized atomic writes
    server/store.ts     # orders, live stock, messages (server-only)
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

Products live in [`src/lib/products.ts`](src/lib/products.ts). Each has `id`, `name`, `price`, optional `compareAtPrice` (shows a *Sale* badge), `imageUrl`, `description`, `stock` (*starting* stock: 0 = sold out, ≤5 = "Only N left"; live stock after orders is kept in the data store — delete `.data/store.json` to reset), `category`, `material`, `care`, `featured`. Categories are derived automatically.

Images currently use `picsum.photos` placeholders. Replace them with real product photos (put files in `public/products/` and use `/products/<file>.jpg`, or add your image host to `images.remotePatterns` in `next.config.ts`).

## Deployment

Configured for **Firebase App Hosting** (`apphosting.yaml`); any Node host or Vercel also works:

```bash
npm run build && npm start
```

Set the environment variables in your hosting provider. Increase `maxInstances` in `apphosting.yaml` for more traffic.

## Data storage

Orders, live stock and contact messages are stored in `.data/store.json` (override with `DATA_DIR`). Writes are serialized and atomic, which is correct for **one Node process with a persistent disk** (local testing, a VPS, `npm start`). Delete the file to reset everything.

## Known limitations / roadmap

- **Serverless / multi-instance hosting** (Vercel, Firebase App Hosting with >1 instance) has no shared persistent disk: re-implement `src/lib/server/store.ts` on a database (e.g. Firestore — the `firebase` SDK is already a dependency). The rest of the app only calls those functions.
- **No order notifications**: new orders appear in `/admin` and are logged to the server console; add email/SMS in `placeOrderAction` (`src/app/actions.ts`) if wanted.
- **Payments are verified manually** by matching the bKash/Nagad transaction ID in `/admin`. Automated verification needs the bKash/Nagad merchant APIs.
- **No rate limiting** on order/contact actions: fake orders reserve stock until cancelled in `/admin`.
- **Reviews** are static seed data; votes are per-visitor UI state only.
- **Product editing** is done in `src/lib/products.ts`, not from the admin UI.

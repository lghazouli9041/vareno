# VARENO — Luxury Faucet eCommerce

Premium architectural faucet brand for the United States market.

## Stack

- Next.js 15 (App Router) · React 19 · TypeScript
- Tailwind CSS 4 · Shadcn-style UI · Framer Motion
- React Hook Form · Zod · TanStack Query
- Prisma · PostgreSQL · Stripe · Cloudinary

## Prerequisites

- Node.js 20+
- PostgreSQL (for later data steps)

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

## Architecture (Step 1)

```
src/
├── app/           # Routes (App Router)
├── components/    # Shared UI, layout, SEO, providers
├── features/      # Domain feature modules
├── hooks/         # Client hooks
├── lib/           # Utilities, SEO, catalog seed
├── services/      # Data/business services
├── actions/       # Server Actions
├── types/         # Domain TypeScript contracts
├── constants/     # Design + catalog constants
├── config/        # Site + navigation config
├── styles/        # Design system tokens
└── middleware.ts  # Edge security headers
prisma/            # PostgreSQL schema
```

## Build roadmap

1. **Foundation & design system** ← current
2. Core UI primitives (Shadcn)
3. Layout shell + navigation
4. Home page
5. Catalog / Shop
6. Product detail
7. Cart / Checkout (Stripe)
8. Account
9. Admin
10. Content pages + SEO hardening

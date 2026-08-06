# VARENO — Production Deployment Guide

**Stack:** Next.js 15 (App Router) · React 19 · Prisma · PostgreSQL · Clerk · Stripe · Cloudinary · Resend  
**Target host:** Vercel (recommended)  
**Repo:** `hajamed` (brand: **VARENO**)

This guide is specific to this codebase. Do not invent routes or env vars that are not used by the app.

---

## 1. Complete deployment checklist

### A. Before you start
- [ ] Domain purchased (example: `vareno.com` or `hajamed.com`)
- [ ] GitHub/GitLab repo connected (or CLI deploy ready)
- [ ] Node.js **20+** locally for migration/seed commands
- [ ] Access to: Vercel, PostgreSQL provider, Clerk, Stripe, Cloudinary, Resend, DNS host

### B. Infrastructure
- [ ] Create production PostgreSQL database
- [ ] Create Vercel project from this repo
- [ ] Set **all required** environment variables in Vercel (Production + Preview as needed)
- [ ] Add custom domain to Vercel
- [ ] Configure DNS (see §9–10)
- [ ] Wait for HTTPS certificate (Vercel automatic)

### C. Database
- [ ] Apply schema to production DB (see §4 — **critical first-time steps**)
- [ ] Seed catalog/collections/coupons/reviews (`npm run db:seed`)
- [ ] Confirm `/api/health` returns `"database": "up"`

### D. Auth (Clerk)
- [ ] Create **Production** Clerk application (or promote instance)
- [ ] Use **live** keys (`pk_live_…` / `sk_live_…`) in Vercel Production
- [ ] Add production domain + redirect URLs
- [ ] Grant first admin (`ADMIN_EMAILS` and/or Clerk `publicMetadata.role = "admin"`)

### E. Payments (Stripe)
- [ ] Switch Stripe Dashboard to **Live** mode
- [ ] Use live publishable + secret keys in Vercel Production
- [ ] Create webhook endpoint → `https://YOUR_DOMAIN/api/webhooks/stripe`
- [ ] Subscribe to event: `checkout.session.completed`
- [ ] Copy webhook signing secret → `STRIPE_WEBHOOK_SECRET`
- [ ] Complete a $1 live test or Stripe test-in-live-checklist order

### F. Media & email
- [ ] Cloudinary cloud name + API key/secret set
- [ ] Resend API key + verified sending domain
- [ ] `EMAIL_FROM` uses a verified domain
- [ ] `ADMIN_NOTIFICATION_EMAIL` receives contact + order alerts

### G. Go-live smoke test
- [ ] Home, shop, PDP load
- [ ] Sign up / sign in (Clerk)
- [ ] Add to cart → checkout → Stripe Checkout → `/order-success`
- [ ] Stripe webhook creates order + decrements inventory
- [ ] Contact form stores message + sends email
- [ ] `/admin` blocked for non-admin; allowed for admin
- [ ] Admin product image upload (Cloudinary)
- [ ] `/api/health` healthy
- [ ] `robots.txt` + `sitemap.xml` reachable
- [ ] CSP does not block Clerk/Stripe (open DevTools console)

### H. Post-launch
- [ ] Monitor Vercel logs + Stripe webhook deliveries
- [ ] Disable Stripe test mode keys in Production env
- [ ] Backup schedule for PostgreSQL
- [ ] Optional: replace `/og/default.svg` with a real `1200×630` JPG later

---

## 2. Required production environment variables

Set these in **Vercel → Project → Settings → Environment Variables** for **Production**.  
Also set Preview vars if you use Preview deployments with real services.

### Required (app will not be production-safe without these)

| Variable | Example / notes |
|----------|-----------------|
| `DATABASE_URL` | `postgresql://USER:PASSWORD@HOST:5432/DB?sslmode=require` |
| `NEXT_PUBLIC_APP_URL` | `https://www.yourdomain.com` (no trailing slash) |
| `NEXT_PUBLIC_SITE_URL` | Same as app URL (drives SEO canonicals / `siteConfig.url`) |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | `pk_live_…` |
| `CLERK_SECRET_KEY` | `sk_live_…` |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | `/sign-in` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | `/sign-up` |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | `/account` |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | `/account` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_live_…` |
| `STRIPE_SECRET_KEY` | `sk_live_…` |
| `STRIPE_WEBHOOK_SECRET` | `whsec_…` from the **live** webhook endpoint |

### Strongly recommended

| Variable | Purpose |
|----------|---------|
| `ADMIN_EMAILS` | Comma-separated admin emails (e.g. `you@yourdomain.com`) |
| `RESEND_API_KEY` | Order confirmation + contact emails |
| `EMAIL_FROM` | `VARENO <orders@yourdomain.com>` (must match verified Resend domain) |
| `ADMIN_NOTIFICATION_EMAIL` | Receives contact form + new-order alerts |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Client/public cloud name |
| `CLOUDINARY_CLOUD_NAME` | Same as above (server) |
| `CLOUDINARY_API_KEY` | Admin image upload |
| `CLOUDINARY_API_SECRET` | Admin image upload |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Digits only, e.g. `18005550148` |

### Ops-only (do not set in Production unless you know why)

| Variable | Purpose |
|----------|---------|
| `SKIP_ENV_VALIDATION=1` | Skips boot env asserts — **never** for real Production |

### Copy-paste template

```bash
# App
NEXT_PUBLIC_APP_URL=https://www.yourdomain.com
NEXT_PUBLIC_SITE_URL=https://www.yourdomain.com
NEXT_PUBLIC_WHATSAPP_NUMBER=18005550148

# Database
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/vareno?sslmode=require

# Clerk (LIVE)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/account
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/account

# Stripe (LIVE)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud
CLOUDINARY_CLOUD_NAME=your_cloud
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# Resend
RESEND_API_KEY=re_...
EMAIL_FROM="VARENO <orders@yourdomain.com>"
ADMIN_NOTIFICATION_EMAIL=concierge@yourdomain.com

# Admin
ADMIN_EMAILS=you@yourdomain.com
```

Runtime validation lives in `src/lib/env.ts` + `src/instrumentation.ts`. Missing critical vars warn during build and **throw at production runtime**.

---

## 3. Required Vercel configuration

### Create project
1. Import this Git repository into Vercel.
2. **Framework Preset:** Next.js (auto-detected).
3. **Root Directory:** repository root (where `package.json` is).
4. **Build Command:** `prisma generate && next build`  
   - Or leave default `next build` **only if** you add a `postinstall` that runs `prisma generate`.  
   - Recommended Build Command:
   ```bash
   prisma generate && next build
   ```
5. **Install Command:** `npm install` (default).
6. **Output:** leave default (Next.js).
7. **Node.js Version:** **20.x** (Project Settings → General).

### Important Vercel settings
| Setting | Value |
|---------|--------|
| Region | Choose closest to US customers (e.g. `iad1`) — match DB region if possible |
| Serverless / Fluid | Default OK |
| Environment | Production domain + Production env vars |
| Preview | Separate keys optional; do **not** point Preview at live Stripe webhook unless intentional |

### Build notes for this repo
- `prisma generate` must run before/during build (`@prisma/client`).
- Do **not** run `db:seed` inside the Vercel build (one-time ops step).
- Do **not** set `SKIP_ENV_VALIDATION` in Production.
- No `vercel.json` is required; `next.config.ts` already sets security headers and image remote patterns.

### Recommended: install-time Prisma generate

If you prefer default Vercel build command, add this to `package.json` later (optional ops change):

```json
"postinstall": "prisma generate"
```

Until then, set Build Command to `prisma generate && next build`.

### Deploy
1. Push to the production branch (usually `main`).
2. Or: `npx vercel --prod` after linking.
3. After first deploy, run DB migrate/push + seed (see §4) using `DATABASE_URL`.
4. Hit `https://YOUR_DOMAIN/api/health`.

---

## 4. Required PostgreSQL configuration

### Provider options
Neon, Supabase, Railway, AWS RDS, Vercel Postgres — any managed Postgres 14+ with SSL.

### Connection string requirements
- Provider: **PostgreSQL** (`prisma/schema.prisma` → `provider = "postgresql"`).
- Include SSL for cloud hosts, typically:
  ```
  ?sslmode=require
  ```
- Prefer a pooled URL for serverless if your provider offers one (Neon “pooled”, PgBouncer, etc.).
- Store the URL only in `DATABASE_URL` (never commit it).

### First-time schema bootstrap (critical)

This repo currently contains an **incremental** migration under:

`prisma/migrations/20260806120000_sprint1_hardening/`

That migration assumes core tables already exist. For a **brand-new empty** production database:

#### Option A — Recommended bootstrap for first production DB
From your laptop (with Production `DATABASE_URL` exported):

```bash
# 1) Create all tables from schema.prisma
npx prisma db push

# 2) Seed catalog, collections, demo coupons/reviews
npm run db:seed

# 3) Mark migration history if you will use migrate deploy later
#    (optional but recommended for team discipline)
npx prisma migrate resolve --applied 20260806120000_sprint1_hardening
```

#### Option B — Going forward (after baseline exists)
```bash
npm run db:migrate:deploy
npm run db:seed   # only if catalog empty / first deploy
```

### Verify
```bash
npx prisma studio
# or
curl https://YOUR_DOMAIN/api/health
# expect: "database": "up"
```

### Backups
Enable automated daily backups on the Postgres provider before accepting live orders.

---

## 5. Required Clerk production configuration

### Dashboard steps
1. Open [Clerk Dashboard](https://dashboard.clerk.com) → create or select **Production** instance.
2. Copy **Publishable key** → `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`.
3. Copy **Secret key** → `CLERK_SECRET_KEY`.
4. **Paths** (must match app routes):
   - Sign-in: `/sign-in`
   - Sign-up: `/sign-up`
   - After sign-in: `/account`
   - After sign-up: `/account`
5. **Domains:**
   - Add `yourdomain.com` and `www.yourdomain.com` (as used in Vercel).
   - Set primary application domain to your production URL.
6. **Redirect allowlist / allowed origins:** include `https://www.yourdomain.com` (and apex if used).

### How this app protects routes
`src/middleware.ts` uses Clerk and protects:
- `/account(.*)`
- `/admin(.*)`

Admin **authorization** is separate (`src/lib/auth/admin.ts`):
1. Clerk `publicMetadata.role` is `"admin"` or `"ADMIN"`, **or**
2. User email is listed in `ADMIN_EMAILS`, **or**
3. Prisma `User.role === ADMIN` (after sync)

### Grant first admin (pick one)
**A. Env (fastest)**  
Set `ADMIN_EMAILS=you@yourdomain.com` in Vercel, redeploy, sign in with that email.

**B. Clerk metadata**  
Users → select user → Public metadata:
```json
{ "role": "admin" }
```

### Do not use test keys in Production
`pk_test_` / `sk_test_` are for Preview/dev only.

---

## 6. Required Stripe production configuration

### Keys
1. Stripe Dashboard → toggle **Live** mode.
2. Developers → API keys:
   - Publishable → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - Secret → `STRIPE_SECRET_KEY`

### Webhook (required for orders + inventory)
This app creates orders and decrements stock on:

**Event:** `checkout.session.completed`  
**Endpoint URL:** `https://YOUR_DOMAIN/api/webhooks/stripe`  
**Handler:** `src/app/api/webhooks/stripe/route.ts`

Steps:
1. Developers → Webhooks → Add endpoint.
2. Endpoint URL as above.
3. Select event: `checkout.session.completed` (minimum required).
4. Create → reveal **Signing secret** → `STRIPE_WEBHOOK_SECRET`.
5. Redeploy Vercel after setting the secret.

### Checkout URLs (built by the app)
Using `NEXT_PUBLIC_APP_URL` / `NEXT_PUBLIC_SITE_URL`:
- Success: `{APP_URL}/order-success?session_id={CHECKOUT_SESSION_ID}`
- Cancel: `{APP_URL}/checkout/cancel`

### Currency
Configured as **USD** in `siteConfig` / checkout.

### Customer portal / tax
Not required for current Checkout Session flow. Enable Stripe Tax later only if you extend the integration.

### Verification
1. Place a live (or carefully controlled) checkout.
2. Stripe webhook shows **200** deliveries.
3. Order appears under `/account/orders` and `/admin/orders`.
4. Variant inventory decreased.

---

## 7. Required Cloudinary configuration

Used by admin product image upload (`src/lib/cloudinary.ts`, commerce admin actions).

1. Create a Cloudinary cloud.
2. Dashboard → set:
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_CLOUD_NAME` (same value)
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
3. Ensure uploads are allowed for authenticated API (default).
4. Folder used by code: `vareno/products`.
5. `next.config.ts` already allows `res.cloudinary.com` images.

Without Cloudinary, storefront still works; **admin image upload fails**.

---

## 8. Required Resend configuration

Used for:
- Order confirmation + admin new-order email (`src/lib/email`)
- Contact form notifications (`src/features/contact/actions.ts`)

### Steps
1. Create Resend account → API key → `RESEND_API_KEY`.
2. Add and verify your domain (DNS records Resend provides — see §9).
3. Set:
   ```bash
   EMAIL_FROM="VARENO <orders@yourdomain.com>"
   ADMIN_NOTIFICATION_EMAIL=concierge@yourdomain.com
   ```
4. `EMAIL_FROM` domain **must** be verified or Resend will reject sends.

Without Resend, checkout still works; emails are skipped/logged.

---

## 9. Required DNS records

Assume apex `yourdomain.com` and `www.yourdomain.com`. Adjust names to your registrar.

### A. Vercel domain
After adding the domain in Vercel, Vercel shows exact records. Typical:

| Type | Name | Value | Purpose |
|------|------|-------|---------|
| `A` | `@` | `76.76.21.21` | Apex → Vercel (confirm in dashboard) |
| `CNAME` | `www` | `cname.vercel-dns.com` | WWW → Vercel (confirm in dashboard) |

Prefer Vercel’s **exact** values from Domain settings (they can vary).

### B. Resend (email sending)
Resend domain setup usually requires:

| Type | Name | Value | Purpose |
|------|------|-------|---------|
| `MX` / `TXT` | as shown in Resend | Resend values | Domain verification |
| `TXT` | `resend._domainkey` (or as shown) | DKIM | Signing |
| `TXT` | `@` or `send` | SPF include Resend | Spoofing protection |

Copy **exactly** from Resend → Domains. Wait until status = **Verified**.

### C. Optional: Clerk custom domain
If you use a Clerk production CNAME (Account Portal / satellite), add the CNAME Clerk displays. Not required for default Clerk-hosted auth at `/sign-in` on your Next domain.

### D. Optional: CAA
If you use CAA records, allow Let’s Encrypt / Vercel certificate authorities so HTTPS issuance works.

### Propagation
DNS can take minutes to 48 hours. Use `dig` / registrar tools before debugging SSL.

---

## 10. Required domain configuration

### Vercel
1. Project → Settings → Domains.
2. Add `www.yourdomain.com` and `yourdomain.com`.
3. Choose redirect policy (recommended: apex → `www` **or** www → apex; keep one canonical).
4. Set the same canonical host in:
   - `NEXT_PUBLIC_APP_URL`
   - `NEXT_PUBLIC_SITE_URL`
5. Wait until domain shows **Valid** + SSL.

### Alignment checklist (canonical host must match everywhere)
| Place | Must match production URL |
|-------|---------------------------|
| Vercel env `NEXT_PUBLIC_APP_URL` | Yes |
| Vercel env `NEXT_PUBLIC_SITE_URL` | Yes |
| Clerk allowed origins / domains | Yes |
| Stripe webhook URL host | Yes |
| Resend links / from-domain | Email domain verified |
| `siteConfig.url` fallback | Overridden by `NEXT_PUBLIC_SITE_URL` |

### Routes that must be publicly reachable
| Path | Purpose |
|------|---------|
| `/` | Storefront |
| `/shop`, `/products/[slug]` | Catalog |
| `/sign-in`, `/sign-up` | Clerk |
| `/api/checkout` | Create Stripe session |
| `/api/webhooks/stripe` | Stripe events (**no auth cookie**) |
| `/api/health` | Health probe |
| `/sitemap.xml`, `/robots.txt` | SEO |

### Routes protected by Clerk middleware
| Path | Access |
|------|--------|
| `/account/*` | Signed-in users |
| `/admin/*` | Signed-in + admin authorization |

---

## Step-by-step deploy sequence (exact order)

### Step 1 — Domain & DNS
1. Buy/configure domain.
2. Create Vercel project (do not need successful build yet).
3. Add domain in Vercel; apply DNS A/CNAME records.
4. Wait for SSL.

### Step 2 — PostgreSQL
1. Create DB in same region as Vercel if possible.
2. Copy connection string with SSL.
3. Locally:
   ```bash
   export DATABASE_URL="postgresql://..."
   npx prisma db push
   npm run db:seed
   ```

### Step 3 — Clerk Production
1. Create Production instance / keys.
2. Configure paths and domains.
3. Prepare `ADMIN_EMAILS` or metadata admin.

### Step 4 — Stripe Live
1. Live API keys.
2. Create webhook to `https://YOUR_DOMAIN/api/webhooks/stripe` for `checkout.session.completed`.
3. Save `whsec_…`.

### Step 5 — Cloudinary + Resend
1. Set Cloudinary vars.
2. Verify Resend domain DNS; set `EMAIL_FROM` + `ADMIN_NOTIFICATION_EMAIL`.

### Step 6 — Vercel env + build
1. Paste all Production env vars (§2).
2. Build Command: `prisma generate && next build`.
3. Node 20.x.
4. Deploy Production.

### Step 7 — Verify
```bash
curl -s https://YOUR_DOMAIN/api/health
curl -sI https://YOUR_DOMAIN/robots.txt
curl -sI https://YOUR_DOMAIN/sitemap.xml
```
Then run the smoke checklist in §1G.

### Step 8 — First admin login
1. Sign up / sign in with an `ADMIN_EMAILS` address.
2. Open `/admin`.
3. Confirm products, orders, inventory, discounts, reviews load.

---

## Operational commands cheat sheet

```bash
# Install
npm install

# Generate Prisma client
npm run db:generate

# First-time empty DB schema
npx prisma db push

# Later deploys (once migrations are baselined)
npm run db:migrate:deploy

# Seed catalog
npm run db:seed

# Local production-like run (after build)
npm run build
npm run start

# Env assert (uses local env)
npm run check:env
```

---

## Known project-specific gotchas

1. **Incremental migration only** — empty DBs need `prisma db push` (or a full baseline migration) before `migrate deploy` alone will work.
2. **Webhook is mandatory** — without Stripe webhook, paid Checkout sessions will not reliably create orders / decrement inventory.
3. **Admin is not “any signed-in user”** — must satisfy admin resolver (`ADMIN_EMAILS` / Clerk role / DB role).
4. **Canonical URL** — SEO and Stripe redirects follow `NEXT_PUBLIC_SITE_URL` / `NEXT_PUBLIC_APP_URL`; mismatch causes auth/cookie/redirect bugs.
5. **CSP** — `next.config.ts` allows Clerk + Stripe + Cloudinary + Resend; if Clerk gives you a custom frontend API domain, you may need to extend CSP after go-live (console will show blocked sources).
6. **Brand defaults** — `siteConfig` still mentions `hajamed.com` as code fallback; Production **must** set `NEXT_PUBLIC_SITE_URL` so public URLs are correct.

---

## Support contacts map (configure to your real addresses)

| Role | Env / config |
|------|----------------|
| Customer support email | `siteConfig.supportEmail` / Resend recipient via `ADMIN_NOTIFICATION_EMAIL` |
| Order FROM address | `EMAIL_FROM` |
| Admin users | `ADMIN_EMAILS` + Clerk |

---

## Definition of “deployed”

VARENO is considered successfully deployed when:

1. `https://YOUR_DOMAIN` serves the storefront over HTTPS.
2. `/api/health` reports database **up**.
3. Clerk sign-in works on production domain.
4. A Checkout payment triggers webhook → order row exists.
5. Contact form delivers email (or is explicitly deferred).
6. An admin can open `/admin` and manage catalog.

---

*End of deployment guide — VARENO / hajamed repo*

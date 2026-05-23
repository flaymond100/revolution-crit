# Revolution Crit — Architecture

A race-registration and results platform for criterium / road cycling events in Germany. Two repos + one Supabase project + Stripe + Render.

---

## Repos

| Path | Purpose |
|---|---|
| `/Users/prln255/revolution-crit` | **Frontend** — React + Vite + TypeScript, deployed as static site |
| `/Users/prln255/revolution-crit-be` | **Backend** — Express + TypeScript, deployed on Render |

Both connect to the same Supabase project: **`okuvxesvadkztizonzky`**.

---

## Stack

- **Frontend**: React 19, Vite 7, TypeScript, Tailwind v4, React Router v7, TanStack Query v5, `@supabase/supabase-js`, `react-hot-toast`, `xlsx` (SheetJS), `react-markdown`
- **Backend**: Express 5, TypeScript, `@supabase/supabase-js`, `stripe`, `cors`, `express-validator`
- **Database**: Supabase (Postgres + RLS + Storage). CLI used for migrations under `revolution-crit-be/supabase/migrations/`.
- **Payments**: Stripe Checkout Sessions + webhooks
- **Hosting**: Frontend = static (Netlify/Vercel-style, deployed from `dist/`). Backend = Render web service, free tier (spins down after 15 min idle).

---

## Database schema

Five tables in `public`. RLS enabled on all of them.

```
race_calendar         A scheduled race event
   ├── id (uuid)
   ├── name, race_date, type, location, description
   ├── external_results_url, external_registration_url
   └── internal_registration (boolean)  ← if true, use our Stripe flow

race_sub_races        A category within a race (e.g. "Männer Elite")
   ├── id (uuid)
   ├── race_calendar_id → race_calendar.id (CASCADE on delete!)
   ├── name (race_category_id enum, e.g. 'maenner_elite')
   └── sort_order

race_sub_race_prices  Time-based pricing tiers per sub-race
   ├── sub_race_id → race_sub_races.id (CASCADE)
   ├── label (text, e.g. "Standard", "Early bird")
   ├── amount_cents
   ├── valid_from (timestamptz, required)
   └── valid_until (timestamptz, nullable = open-ended)

participants          A registered/result-listed rider
   ├── id (uuid)
   ├── full_name, date_of_birth, gender, team_name, nationality
   ├── email, phone, uci_number
   └── (no unique constraint on email — dedup is done at app layer)

race_entries          One rider in one category — both registration AND result
   ├── sub_race_id → race_sub_races.id (CASCADE)
   ├── participant_id → participants.id (CASCADE)
   ├── UNIQUE (sub_race_id, participant_id)
   ├── is_paid (true for Stripe-paid; false for manual/admin entries)
   ├── payment_amount, payment_currency, payment_date
   ├── from_results_upload (boolean) ← true if created via XLSX import
   ├── position, time_text, status ('finished'/'dns'/'dnf'/'dsq')
   ├── bib_number (unused in UI — column kept for legacy)
   └── notes

race_categories       Lookup table for category labels
   ├── id (race_category_id enum)
   └── label (text)
```

### `race_category_id` enum

Includes: `jedermann_leicht`, `jedermann_mittel`, `jedermann_schwer`, `jedefrau`, `maenner_elite`, `frauen_elite`, `masters_2/3/4`, `u11w/m`, `u13w/m`, `u15w/m`, `u17w/m`, `juniorinnen`, `junioren`, `fixed_gear_men`, `flinta`, `frauen`, `men_under_18`, `women_under_18`, `men_over_18`, `women_over_18`.

### Important schema constraints / quirks

- **`race_entries.sub_race_id ON DELETE CASCADE`**: deleting a sub-race wipes all its entries (including past results). Be careful when editing a race after registrations exist.
- **Stripe race condition**: Stripe sessions stay payable for ~24h after creation. If admin deletes a sub-race in that window, the webhook gets a FK violation. The webhook logs `Failed to upsert race_entry:` but the payment was taken — needs manual cleanup.
- **Two RLS policy sets per table**: a generic "Authenticated full access" policy + an admin-only one with `jwt user_role = 'admin'`. The generic one is what actually permits admin writes; the role-claim one is currently a no-op because admin JWTs don't have that custom claim.
- **`race_sub_race_prices`** only has the generic policy (added by migration `20260505000002_fix_race_sub_race_prices_rls.sql`).

### Migrations

All in `revolution-crit-be/supabase/migrations/`. Push with `supabase db push` (from the BE repo, which is `supabase link`-ed to the project). They are **not** run automatically by Render; manual push.

Chronologically:
- `20260505000001` — add `internal_registration` flag + `race_sub_race_prices` table
- `20260505000002` — RLS fix for `race_sub_race_prices`
- `20260512000001` — add `from_results_upload` to `race_entries`
- `20260513000001` — add `uci_number` to `participants`
- `20260513000002` / `00003` — add `frauen` category to enum + label
- `20260521000001` — add age/gender categories (`men_under_18`, etc.)

---

## Backend (`revolution-crit-be`)

Entry: `index.ts` → `src/app.ts`.

### Key files

```
src/
├── app.ts                              Express app, CORS, routes, error handler
├── config/
│   ├── stripe.ts                       Stripe client (singleton)
│   └── supabase.ts                     Two clients: `supabase` (anon) + `supabaseService` (service role, bypasses RLS)
├── routes/
│   ├── auth.ts                         /api/auth/{register,login,logout,me}
│   └── payments.ts                     /api/payments/create-payment-intent
├── controllers/
│   ├── authController.ts
│   └── paymentController.ts            createIntent + handleWebhook
├── services/
│   └── paymentService.ts               createCheckoutSession + handleWebhookEvent + helpers
└── middleware/
    ├── authenticate.ts
    └── validate.ts
```

### Stripe flow

1. FE form POSTs `/api/payments/create-payment-intent` with `{ subRaceId, participant, successUrl, cancelUrl }`. **Amount is never trusted from client.**
2. BE `createCheckoutSession`:
   - Looks up active price from `race_sub_race_prices` (server-authoritative). Errors if none.
   - Looks up race name + category label via `getSubRaceContext`.
   - Creates Stripe Checkout Session with: `customer_email`, line item with `unit_amount` + `product_data.name = "{Race} — {Category}"`, `invoice_creation: { enabled: true }`, metadata containing the full participant payload (JSON).
3. BE returns `{ checkoutUrl, sessionId }`. FE redirects.
4. After payment, Stripe POSTs `/api/payments/webhook` (raw body, signature verified with `STRIPE_WEBHOOK_SECRET`).
5. `handleWebhookEvent` on `checkout.session.completed`:
   - Parses metadata's `registration_payload`.
   - `findOrCreateParticipant(payload.participant)` — dedup on (`email`, `full_name`, `date_of_birth`) all three required.
   - Upserts `race_entries` row with `is_paid: true`, payment info, `notes: "Stripe checkout session: cs_..."`.
   - **Uses `supabaseService` (service-role client) — bypasses RLS.**

### CORS

`isDev` flag (true when `NODE_ENV !== 'production'`) auto-allows any `localhost:*` origin. Otherwise checks against `ALLOWED_ORIGINS` env var (comma-separated). The `cors()` middleware handles OPTIONS preflight on its own — don't add `app.options('*', ...)` because Express 5's path-to-regexp rejects unnamed wildcards.

### Webhook body handling

`app.post('/api/payments/webhook', express.raw(...), handleWebhook)` is registered **before** `app.use(express.json())` so Stripe's signature verification works on the raw bytes. JSON parsing applies to all other routes.

---

## Frontend (`revolution-crit`)

Entry: `src/main.tsx` → `src/App.tsx`. Routes defined inline in `App.tsx`.

### Key directories

```
src/
├── App.tsx                             Routes + QueryClient + <Toaster />
├── components/
│   ├── AppLayout.tsx                   Outlet + Header + Footer
│   ├── Header.tsx                      Top nav
│   ├── Footer.tsx
│   ├── RaceCard.tsx                    Card view of a race (HomePage)
│   ├── RaceTable.tsx                   Tabular view (HomePage + RacesPage)
│   └── RequireAuth.tsx                 Wrapper that redirects to /login if no session
├── pages/
│   ├── HomePage.tsx
│   ├── LoginPage.tsx
│   ├── RoutePages.tsx                  RaceDetailPage + ResultsPage + ResultsSeasonPage + ResultsRacePage + many placeholders (About/Contact/FAQ/etc.)
│   ├── RaceRegistrationPage.tsx
│   ├── RegistrationSuccessPage.tsx
│   ├── RaceResultsPage.tsx             Admin: edit results + XLSX upload
│   ├── NewRacePage.tsx                 Admin
│   ├── EditRacePage.tsx                Admin
│   └── utils.ts                        Registration form types + initial state + validateForm
├── lib/
│   ├── supabase.ts                     FE Supabase client (anon key)
│   ├── raceCalendar.ts                 fetchRaceCalendars + fetchRaceCalendarById + mappers
│   ├── raceCategories.ts               fetch labels for the race_category_id enum
│   ├── racePresentation.ts             registrationStatus + toRaceItem helpers for the table/card views
│   ├── paymentApi.ts                   createPaymentCheckout → BE
│   ├── participants.ts                 findOrCreateParticipant for admin manual entries (same dedup rule as BE)
│   └── nations.ts                      NATIONS list (IOC 3-letter codes + labels) for the registration form's Nation dropdown
└── types.ts                            All TS types (DB rows, mapped domain types, RaceCalendarWithRelations)
```

### Routes (public unless noted)

| Path | Page |
|---|---|
| `/` | HomePage — upcoming highlight + calendar |
| `/calendar` | RacesPage — list of all races |
| `/calendar/:slug` | RaceDetailPage — info, Register/Results button, public participants by category (when `internalRegistration` is true) |
| `/calendar/:slug/register` | RaceRegistrationPage |
| `/registration-success?raceId=X` | After Stripe redirect |
| `/results` | Season picker (hardcoded `[2026]` in `AVAILABLE_SEASONS`) |
| `/results/:season` | List of past races in that year |
| `/results/:season/:raceSlug` | ResultsRacePage — filters entries by `fromResultsUpload === true`, displays results table |
| `/races/new` | **Admin** — create race |
| `/races/:raceId/edit` | **Admin** — edit race + sub-races + prices |
| `/races/:raceId/results` | **Admin** — edit results + add manual entries + XLSX import |
| `/login` | LoginPage |
| `/about`, `/contact`, `/faq`, `/privacy`, `/imprint`, etc. | Static/placeholder content |

Admin routes are wrapped in `<RequireAuth>` which checks for any Supabase session — no explicit role check.

### Critical flow: registration

`RaceRegistrationPage` collects form (`utils.ts/RegistrationFormState`), validates, then calls `createPaymentCheckout` (in `paymentApi.ts`) which POSTs the BE. On success, redirects to Stripe URL. Stripe redirects back to `/registration-success?raceId={uuid}` which shows "Back to the race" link.

### Critical flow: results upload

Admin opens `/races/:raceId/results`. Each category section has:
- Inline-editable table of existing entries (bib was removed)
- "+ Add participant manually" form
- "Upload XLSX results" button — expects columns `position, firstName, lastName, team, time`. Parses with `xlsx`, then:
  1. Deletes existing `race_entries` for that sub-race where `from_results_upload = true` (re-upload replaces previous import)
  2. For each row: `findOrCreateParticipant` (dedup by email+name+DOB — but XLSX rows lack email/DOB so always creates new), inserts `race_entries` with `from_results_upload: true`, `status: 'finished'`, `is_paid: false`

The public `/results/:season/:raceSlug` page **filters by `fromResultsUpload === true`** so it shows only the imported results, not the registered list.

### Hidden categories

In `RaceRegistrationPage`, `sortedSubRaces` filters out `s.name === 'frauen'` so the "Frauen" category is configurable on a race but hidden from public registration. Pattern can be extended if more results-only categories appear.

### Toast feedback

`<Toaster />` in App.tsx. Success toasts on: race created, race updated, results saved, participant added, XLSX rows imported. No loading or error toasts currently (errors shown inline).

### Type-naming convention

Snake-case for DB row interfaces (`ParticipantRow`, `RaceCalendarRow`), camelCase for mapped domain types (`Participant`, `RaceCalendar`). Mappers in `lib/raceCalendar.ts`.

---

## Environment variables

### Frontend (`.env`)

```
VITE_API_BASE_URL              # BE URL — e.g. http://localhost:3003 or https://revolution-crit-be.onrender.com
VITE_SUPABASE_URL              # Supabase project URL
VITE_SUPABASE_ANON_KEY         # Supabase anon JWT (safe in browser)
```

### Backend (`.env`)

```
PORT                           # 3003 locally, Render assigns its own
NODE_ENV                       # production on Render, development locally
ALLOWED_ORIGINS                # comma-separated, only enforced when NODE_ENV=production
SUPABASE_URL
SUPABASE_ANON_KEY              # respects RLS
SUPABASE_SERVICE_ROLE_KEY      # bypasses RLS — used by webhook to write participants/entries
STRIPE_SECRET_KEY              # sk_live_... in prod, sk_test_... locally
STRIPE_WEBHOOK_SECRET          # whsec_... — different per Stripe webhook endpoint, different between test and live mode
```

---

## Deployment

### Frontend

Built with `pnpm build` → static `dist/`. Bundle is ~1MB (xlsx is the biggest chunk; not code-split currently). Pushed to whatever static host the user chose.

### Backend on Render

Settings:
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start` (which runs `node dist/index.js`)
- Auto-deploys on push to `main` of `revolution-crit-be` GitHub repo.

Free tier spins down after 15 min idle → cold start ~30s. Either upgrade to Starter ($7/mo) or use UptimeRobot to ping `/health` every 10 min.

### Stripe

Two parallel environments (test mode + live mode) in the dashboard. Each has its own:
- API keys
- Webhook endpoints (and signing secrets)
- Settings (invoice emails, etc.)

When switching prod ↔ test you have to update both `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` on Render together.

---

## Conventions / decisions worth knowing

- **One DB for past + future races.** Results live in `race_entries` (no separate results table), with `from_results_upload` distinguishing imported results from registrations.
- **Manual transfer between Stripe accounts** rather than Stripe Connect — both accounts are owned by the same person, so the engineering cost wasn't worth it.
- **Participant dedup** runs only when email + name + DOB are all present. XLSX uploads always create new participants because the file format lacks email/DOB.
- **Server-authoritative pricing.** The FE displays the price but the BE re-resolves it from `race_sub_race_prices` before creating the Stripe session. Client-supplied amounts are rejected.
- **No bib_number in UI** anywhere. Column kept in DB for legacy/future use.
- **`isPast` rule**: `new Date(raceDate) < startOfToday()`. Same-day races are considered upcoming until the next day rolls over.
- **Frontend handles its own routing.** No SSR. All pages fetch data via TanStack Query directly from Supabase (registration is the only path that goes through the BE).
- **The BE only mediates Stripe.** Every other read/write is Supabase ↔ FE directly under RLS.

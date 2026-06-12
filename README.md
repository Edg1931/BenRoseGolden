# Benjamin Rose × The Golden Group — Partnership Tools

Two modules sharing one Next.js (App Router) app shell + Supabase auth, deployed
on Vercel.

- **Module 1 — ESOP / Benjamin Rose referral tracker.** A shared pipeline both
  teams see: people who complete the Benjamin Rose/ESOP homebuyer program and get
  referred to The Golden Group. Kanban by stage, filters, and a metrics strip
  (counts by stage + graduate→close rate).
- **Module 2 — Ohio down-payment-assistance & grant finder.** A buyer answers a
  few questions and sees every program they qualify for, with the ones their HUD
  certificate unlocks called out. (Schema + matching engine + curated seed built;
  buyer questionnaire UI is the next milestone.)

## Stack

Next.js 15 · TypeScript · Tailwind + shadcn-style components · Supabase
(Postgres + Auth + RLS) · Zod schemas.

## Local development

```bash
npm install
cp .env.example .env.local   # optional — see below
npm run dev
```

**Without Supabase env set**, the app runs on in-memory seed data so the UI works
immediately. Switch roles in dev with cookies to exercise RBAC:

- `dev_role` = `golden-agent` (default) | `benjamin-rose` | `admin`
- `dev_org` = `benjamin-rose` | `esop` (for `benjamin-rose` role)

## Project structure

```
app/
  (dashboard)/
    layout.tsx                 shared shell: nav, brand, role badge, auth
    referrals/page.tsx         MODULE 1 — kanban pipeline + metrics + filters
    dpa-finder/page.tsx        MODULE 2 — program list (questionnaire next)
  api/referrals/route.ts       list/create (redacted, role-scoped)
  api/referrals/[id]/route.ts  get/update (column-level limits for BR staff)
lib/
  auth/roles.ts                role model + can-view / can-edit / limited-edit
  auth/session.ts              current user (Supabase, or dev cookie fallback)
  referrals/schema.ts          MODULE 1 Zod schema, enums, labels
  referrals/redaction.ts       consent gate — strips contact when no consent
  referrals/metrics.ts         counts by stage + graduate→close rate
  referrals/repository.ts      data layer (Supabase or in-memory) + RBAC
  programs/schema.ts           MODULE 2 Zod schema
  programs/matching.ts         matching engine — ranked "you qualify because…"
  programs/sources/            data-source adapters (curated + DPR stub)
  supabase/server.ts           request-scoped Supabase client
data/programs.seed.json        2–3 sample Ohio programs (full schema shape)
supabase/migrations/0001_init.sql   tables + RLS mirroring app RBAC
```

## Privacy model (Module 1)

This is vulnerable-population data. Enforced, not advisory:

1. **Only referral-stage fields are stored.** The schema has no fields for
   counseling notes or financial documents — there is nowhere to put a
   counseling file.
2. **Consent gate.** Contact info (email/phone) is stripped *server-side* in
   `redactReferral` unless `consentToShare === true`. `assertContactUsable`
   throws if any code tries to use contact info without consent.
3. **Role-based access.** Golden Group agents edit fully. Benjamin Rose staff
   see + limited-edit only their own organization's referrals (no pipeline-state
   edits). Enforced in the repository **and** in Supabase RLS.

## Applying the Supabase schema

```bash
supabase db push          # or apply supabase/migrations/0001_init.sql
```

Then create a `profiles` row per user with their `role` and (for Benjamin Rose
staff) `org`. Set `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`
to switch the app off seed data and onto the live database.

## Module 2 — adding the full dataset / DPR API

- Drop the full statewide Ohio JSON into `data/programs.seed.json` (same shape).
- The **Down Payment Resource API** integration point is `lib/programs/sources/dpr.ts`.
  Implement `load()` and set `DPR_API_BASE_URL` + `DPR_API_KEY`; it merges
  automatically via `loadAllPrograms()` — no engine or UI changes.

## Keeping programs up to date with AI (Module 2)

The DPA finder has a **"Refresh with AI"** button (Golden Group / admin only)
that uses Claude with web search to find current Ohio DPA/grant programs.

- **Review-gated, never auto-applied.** This data drives decisions for
  vulnerable buyers, so the agent returns *candidates*. Each is diffed against
  the current database (New / Changed / Unchanged) and approved per-item before
  anything is saved.
- `lib/programs/refresh/agent.ts` — Claude (Opus 4.8) + `web_search`; the model
  returns a structured list via a `submit_programs` tool, validated with Zod.
  Set `ANTHROPIC_API_KEY` to enable; the button is disabled without it.
- `POST /api/programs/refresh` runs the agent and returns diffed candidates.
  `POST /api/programs/apply` persists approved ones (Supabase `programs` table
  when configured, else returns JSON to commit into the seed file).
- The agent never invents figures (uses `null` when a source omits them),
  requires an official `sourceUrl` per program, and attaches a confidence level
  + reviewer note. It does **not** scrape lenders — it researches programs.
```

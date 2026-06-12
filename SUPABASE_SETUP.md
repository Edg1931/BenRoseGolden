# Going live with Supabase (persistent + multi-user)

The app runs on in-memory seed data until Supabase env vars are set. With them
set, every module (participants, referrals, programs, campaigns) reads/writes
the database, Row-Level Security enforces access, and the app becomes
multi-user. No code changes are needed to switch over.

## 1. Create a project & apply migrations

Apply the SQL in `supabase/migrations/` in order:

```
0001_init.sql          profiles + referrals + roles/helpers + RLS
0002_programs.sql      curated DPA programs (AI-refresh target)
0003_participants.sql  Benjamin Rose participants CRM
0004_campaigns.sql     newsletters & flyers
```

Either with the Supabase CLI:

```bash
supabase link --project-ref <ref>
supabase db push
```

…or paste each file into the SQL editor (or use the Supabase MCP `apply_migration`).

## 2. Set environment variables

Copy `.env.example` → `.env.local` and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...      # server-only
ANTHROPIC_API_KEY=...              # enables AI program-refresh + content drafting
```

## 3. Create staff users & profiles

Auth users sign in via Supabase Auth. Each needs a `profiles` row with their
role and (for Benjamin Rose staff) org:

```sql
insert into profiles (id, email, name, role, org) values
  ('<auth-user-uuid>', 'counselor@benrose.org', 'Counselor Rivera', 'benjamin-rose', 'benjamin-rose'),
  ('<auth-user-uuid>', 'agent@goldengroup.com', 'Jordan Avery', 'golden-agent', null),
  ('<auth-user-uuid>', 'admin@partnership.org', 'Admin', 'admin', null);
```

Roles: `admin` (all), `golden-agent` (full edit, all orgs), `benjamin-rose`
(their own org only). RLS enforces this at the database, mirroring the app.

## 4. How access works once live

- `middleware.ts` refreshes the auth session and redirects unauthenticated
  users to the public `/welcome` page (the newsletter signup stays public).
- Benjamin Rose staff see only their org's participants/referrals; Golden Group
  and admins see all. Contact info still requires `consentToShare` before it
  crosses to The Golden Group.

## Notes / privacy

This is vulnerable-population PII. Before importing real client data, confirm
the project's region/data-residency and retention settings, restrict the
service-role key to server use only, and review the RLS policies. The DPA
`programs` table is currently a write target for the AI refresh; the finder
still reads the curated JSON seed until you point it at the table.

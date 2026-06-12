-- Module 2 — curated Ohio program database (and the AI-refresh target table).
-- Programs are public, read-only reference data for the matching engine; only
-- Golden Group / admins may write them (mirrors the API-layer check).

create table programs (
  id text primary key,
  name text not null,
  provider text not null,
  level text not null check (level in ('state', 'county', 'city', 'nonprofit')),
  geography jsonb not null,
  "assistanceType" text not null
    check ("assistanceType" in ('grant', 'forgivable-loan', 'deferred-second', 'mcc-tax-credit')),
  benefit jsonb not null,
  eligibility jsonb not null,
  "requiresHomebuyerEd" boolean not null default false,
  "mustUseApprovedLender" boolean not null default false,
  "participatingLenders" jsonb,
  "howToApply" text not null,
  "sourceUrl" text not null,
  "lastVerified" text not null,
  "dataSource" text not null default 'curated' check ("dataSource" in ('curated', 'dpr')),
  updated_at timestamptz not null default now()
);

alter table programs enable row level security;

-- Anyone signed in can read curated programs (they drive the buyer-facing finder).
create policy "programs are readable by authenticated users"
  on programs for select
  using (auth.role() = 'authenticated');

-- Only Golden Group / admins may write (insert/update/delete). Reuses is_golden_side().
create policy "programs writable by golden side"
  on programs for all
  using (is_golden_side())
  with check (is_golden_side());

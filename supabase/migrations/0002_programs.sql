-- Module 2 — curated Ohio program database (and the AI-refresh target table).
-- Programs are public, read-only reference data for the matching engine; only
-- Golden Group / admins may write them (mirrors the API-layer check).
--
-- Mirrors lib/programs/schema.ts: `amount` is human-readable text, structured
-- fields are jsonb, and requiresHomebuyerEd / mustUseApprovedLender are text so
-- they can hold the tri-state value 'true' | 'false' | 'verify'.

create table programs (
  id text primary key,
  name text not null,
  provider text not null,
  level text not null check (level in ('state', 'regional', 'county', 'city', 'nonprofit')),
  geography jsonb not null,
  "assistanceType" text not null
    check ("assistanceType" in (
      'grant', 'forgivable_loan', 'deferred_loan', 'second_mortgage',
      'rate_discount', 'tax_credit', 'match'
    )),
  amount text not null,
  "amountStructured" jsonb,
  eligibility jsonb not null,
  "requiresHomebuyerEd" text not null,
  "mustUseApprovedLender" text,
  "participatingLenders" jsonb,
  repayment text,
  "howToApply" text not null,
  "sourceUrl" text not null,
  "lastVerified" text not null,
  notes text,
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

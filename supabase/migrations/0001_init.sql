-- Benjamin Rose / Golden Group partnership — Module 1 schema + RLS.
-- Privacy model: vulnerable-population data. Row scoping is enforced in the
-- database so Benjamin Rose staff can only reach their own org's referrals,
-- mirroring lib/auth/roles.ts.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Profiles: app role + org for each auth user.
-- ---------------------------------------------------------------------------
create type user_role as enum ('admin', 'golden-agent', 'benjamin-rose');
create type referral_org as enum ('benjamin-rose', 'esop');

create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  name text,
  role user_role not null default 'benjamin-rose',
  org referral_org,
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "profiles are readable by the owner"
  on profiles for select
  using (auth.uid() = id);

-- Helper: is the current user on the Golden Group side (full access)?
create or replace function is_golden_side() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from profiles
    where id = auth.uid() and role in ('admin', 'golden-agent')
  );
$$;

-- Helper: the current benjamin-rose user's org (null for golden side).
create or replace function current_user_org() returns referral_org
language sql stable security definer set search_path = public as $$
  select org from profiles where id = auth.uid();
$$;

-- ---------------------------------------------------------------------------
-- Referrals: ONLY referral-stage fields. No counseling-file content.
-- ---------------------------------------------------------------------------
create type referral_source as enum ('benjamin-rose', 'esop');
create type program_type as enum ('homebuyer-ed', 'pre-purchase', 'foreclosure', 'post-purchase');
create type referral_stage as enum (
  'referred', 'contacted', 'home-search', 'under-contract', 'closed', 'on-hold', 'declined'
);
create type referral_outcome as enum (
  'in-progress', 'purchased-home', 'not-ready', 'lost-other-agent', 'withdrew'
);

create table referrals (
  id uuid primary key default gen_random_uuid(),
  "firstName" text not null,
  "lastInitial" text not null check (char_length("lastInitial") = 1),

  -- Contact info is consent-gated. Stored, but only served when consent = true.
  contact jsonb,

  source referral_source not null,
  "programType" program_type not null,

  "certificateCompleted" boolean not null default false,
  "certificateDate" timestamptz,

  "consentToShare" boolean not null default false,
  "consentDate" timestamptz,

  stage referral_stage not null default 'referred',
  "assignedAgent" text,

  "dateReferred" timestamptz not null default now(),
  "lastUpdated" timestamptz not null default now(),

  notes text,
  outcome referral_outcome not null default 'in-progress'
);

create index referrals_source_idx on referrals (source);
create index referrals_stage_idx on referrals (stage);

alter table referrals enable row level security;

-- SELECT: golden side sees all; benjamin-rose sees only their own org.
create policy "referrals readable by golden side or owning org"
  on referrals for select
  using (is_golden_side() or source = current_user_org());

-- INSERT: golden side can create any; benjamin-rose only for their own org.
create policy "referrals insertable by golden side or owning org"
  on referrals for insert
  with check (is_golden_side() or source = current_user_org());

-- UPDATE: golden side full edit; benjamin-rose may update rows in their own org.
-- Column-level limits (no stage/assignedAgent/outcome edits for benjamin-rose)
-- are enforced in the API layer (lib/referrals/repository.ts).
create policy "referrals updatable by golden side or owning org"
  on referrals for update
  using (is_golden_side() or source = current_user_org())
  with check (is_golden_side() or source = current_user_org());

-- DELETE: admins only.
create policy "referrals deletable by admins"
  on referrals for delete
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

-- Keep lastUpdated fresh on every write.
create or replace function touch_last_updated() returns trigger
language plpgsql as $$
begin
  new."lastUpdated" = now();
  return new;
end;
$$;

create trigger referrals_touch_last_updated
  before update on referrals
  for each row execute function touch_last_updated();

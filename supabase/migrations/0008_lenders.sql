-- Preferred lenders: partner profiles (loan officer + institution), the
-- languages they serve, the programs they offer, and a partnership/advertising
-- tier. Lender info is public-facing (marketing), so SELECT is open; only staff
-- can create or edit.

create table lenders (
  id uuid primary key default gen_random_uuid(),

  "institutionName" text not null,
  "contactName" text,
  title text,
  email text,
  phone text,
  website text,
  nmls text,
  "logoUrl" text,

  address jsonb,
  "serviceCounties" jsonb not null default '[]',
  languages jsonb not null default '["en"]',
  "loanTypes" jsonb not null default '[]',
  programs jsonb not null default '[]',

  "marketingBlurb" text,

  tier text not null default 'standard' check (tier in ('featured','preferred','standard')),
  advertising boolean not null default false,
  "monthlyRate" numeric,
  "partnerSince" text,
  "receivesReferrals" boolean not null default true,

  active boolean not null default true,
  notes text,

  "dateAdded" text not null,
  "lastUpdated" text not null
);

create index lenders_tier_idx on lenders (tier);
create index lenders_active_idx on lenders (active);

alter table lenders enable row level security;

-- Public directory: anyone may read lenders (marketing surface).
create policy "lenders readable by everyone" on lenders for select using (true);

-- Only staff (golden side or benjamin-rose) may create/edit/remove.
create policy "lenders insertable by staff" on lenders for insert
  with check (is_golden_side() or current_user_org() is not null);
create policy "lenders updatable by staff" on lenders for update
  using (is_golden_side() or current_user_org() is not null)
  with check (is_golden_side() or current_user_org() is not null);
create policy "lenders deletable by admins" on lenders for delete
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

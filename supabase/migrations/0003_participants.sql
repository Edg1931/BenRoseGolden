-- Benjamin Rose Participants CRM. BR is the data controller; staff see only
-- their own org's participants (mirrors lib/auth/roles.ts + lib/participants).
-- Rich/nested fields are stored as jsonb to match the Zod schema.

create table participants (
  id uuid primary key default gen_random_uuid(),
  org referral_org not null default 'benjamin-rose',

  "firstName" text not null,
  "lastName" text,
  "preferredName" text,

  email text,
  phone text,
  address jsonb,

  "preferredLanguage" text not null default 'en',
  "preferredFormats" jsonb not null default '[]',
  "contactChannels" jsonb not null default '[]',
  "doNotContact" boolean not null default false,

  household jsonb not null default '{"creditBand":"unknown"}',
  tracks jsonb not null default '[]',

  stage text not null default 'lead'
    check (stage in ('lead','enrolled','in-progress','graduated','referred','inactive')),
  "stageSince" text,
  "assignedCounselor" text,

  "moduleProgress" jsonb not null default '[]',
  certificates jsonb not null default '[]',
  communications jsonb not null default '[]',

  tags jsonb not null default '[]',
  source text not null default 'class',

  "consentToShare" boolean not null default false,
  "consentDate" text,
  "referralId" uuid references referrals(id) on delete set null,

  notes text,
  "dateAdded" text not null,
  "lastUpdated" text not null
);

create index participants_org_idx on participants (org);
create index participants_stage_idx on participants (stage);
create index participants_name_idx on participants ("lastName", "firstName");

alter table participants enable row level security;

-- Golden side sees all; benjamin-rose staff see only their own org.
create policy "participants readable by golden side or owning org"
  on participants for select
  using (is_golden_side() or org = current_user_org());

create policy "participants insertable by golden side or owning org"
  on participants for insert
  with check (is_golden_side() or org = current_user_org());

create policy "participants updatable by golden side or owning org"
  on participants for update
  using (is_golden_side() or org = current_user_org())
  with check (is_golden_side() or org = current_user_org());

create policy "participants deletable by admins"
  on participants for delete
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

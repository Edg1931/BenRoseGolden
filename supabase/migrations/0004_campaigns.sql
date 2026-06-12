-- Module 3 — marketing campaigns (newsletters & flyers). Staff-managed content;
-- any authenticated staff user can read/write. Audience is stored as jsonb.

create table campaigns (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('newsletter', 'flyer')),
  title text not null,
  subject text,
  audience jsonb not null default '{}',
  language text not null default 'en',
  "bodyMarkdown" text not null default '',
  status text not null default 'draft' check (status in ('draft', 'ready', 'sent')),
  "draftedBy" text,
  "createdAt" text not null,
  "updatedAt" text not null
);

create index campaigns_status_idx on campaigns (status);

alter table campaigns enable row level security;

create policy "campaigns readable by authenticated staff"
  on campaigns for select
  using (auth.role() = 'authenticated');

create policy "campaigns writable by authenticated staff"
  on campaigns for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

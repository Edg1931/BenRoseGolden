-- Newsletter sending — adds send bookkeeping to campaigns and a per-recipient
-- sent-log. Staff-managed marketing data: any authenticated staff user may
-- read/write (mirrors the campaigns policy in 0004).

alter table campaigns add column if not exists "sentAt" timestamptz;
alter table campaigns add column if not exists "sentCount" integer;

create table campaign_sends (
  id uuid primary key default gen_random_uuid(),
  "campaignId" uuid not null references campaigns(id) on delete cascade,
  "participantId" uuid not null references participants(id) on delete cascade,
  email text not null,
  status text not null default 'sent' check (status in ('sent', 'failed')),
  error text,
  "sentAt" timestamptz not null default now()
);

create index campaign_sends_campaign_idx on campaign_sends ("campaignId");

alter table campaign_sends enable row level security;

create policy "campaign sends readable by authenticated staff"
  on campaign_sends for select
  using (auth.role() = 'authenticated');

create policy "campaign sends writable by authenticated staff"
  on campaign_sends for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

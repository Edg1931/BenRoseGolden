-- Module 2 — scheduled AI-refresh review queue.
--
-- The weekly Vercel Cron job (/api/cron/refresh-programs) runs the research
-- agent, diffs candidates against the live `programs` table, and stores the run
-- here as a REVIEW QUEUE. Staff approve candidates into `programs` from the
-- dashboard; nothing auto-publishes. The cron writes with the service-role key
-- (bypasses RLS); staff read via the policy below.

create table program_refresh_runs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  trigger text not null default 'cron' check (trigger in ('cron', 'manual')),
  model text not null,
  summary jsonb not null,
  -- Full diffed candidate list for review (DiffedCandidate[]).
  candidates jsonb not null,
  status text not null default 'pending_review'
    check (status in ('pending_review', 'reviewed'))
);

create index program_refresh_runs_status_idx
  on program_refresh_runs (status, created_at desc);

alter table program_refresh_runs enable row level security;

-- Only Golden Group / admins may read the review queue (reuses is_golden_side()).
create policy "refresh runs readable by golden side"
  on program_refresh_runs for select
  using (is_golden_side());

create policy "refresh runs writable by golden side"
  on program_refresh_runs for all
  using (is_golden_side())
  with check (is_golden_side());

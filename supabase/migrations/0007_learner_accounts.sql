-- Learner self-service: visitors create a profile to take the classes and become
-- a Benjamin Rose lead. A learner is a Supabase Auth user WITHOUT a staff profile;
-- their CRM record (participants row) is linked by authUserId = auth.uid().
--
-- Staff RLS (0003) still applies and is OR-combined with the learner policies
-- below, so staff continue to see/manage their org while a learner can only
-- read and update their own record.

alter table participants
  add column "authUserId" uuid references auth.users (id) on delete set null;

create index participants_auth_user_idx on participants ("authUserId");

-- A learner can read their own record.
create policy "participants readable by owning learner"
  on participants for select
  using ("authUserId" = auth.uid());

-- A learner can self-enroll (must stamp their own id, Benjamin Rose org, web source).
create policy "participants self-enroll insert"
  on participants for insert
  with check (
    "authUserId" = auth.uid()
    and org = 'benjamin-rose'
    and source = 'web'
    and stage = 'lead'
  );

-- A learner can update their own record (financial snapshot, progress sync).
create policy "participants updatable by owning learner"
  on participants for update
  using ("authUserId" = auth.uid())
  with check ("authUserId" = auth.uid());

-- NOTE for go-live: so the self-enroll INSERT runs while authenticated, disable
-- "Confirm email" in Supabase Auth (Authentication → Providers → Email) OR perform
-- the insert with the service-role key right after sign-up. With confirmation on,
-- signUp returns no session and the RLS insert above would be rejected until the
-- user confirms.

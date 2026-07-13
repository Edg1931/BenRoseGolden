-- Deal financials + Benjamin Rose give-back + obstacle reason on referrals.
-- `deal` holds salePrice / commissionAmount / benjaminRoseContribution /
-- contributionPaid / expectedCloseDate / closedDate; `blockerReason` powers the
-- partnership obstacles report. Both are Golden-side-owned (app + RLS enforce edit).

alter table referrals
  add column if not exists deal jsonb,
  add column if not exists "blockerReason" text;

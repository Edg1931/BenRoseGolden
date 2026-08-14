import type { AuthUser } from "@/lib/auth/roles";
import type { Track } from "@/lib/participants/curriculum";
import type { ArticleTopic } from "./article-topics";
import type { Audience, Campaign } from "./schema";

/**
 * Monthly newsletter automation.
 *
 * Clients are bunched by their needs tags (participant `tracks` — set at
 * sign-up, by intake, or on the profile). On the 1st of each month, every
 * segment below gets its own designed issue: segment-matched articles, the
 * live assistance data, and the current featured partners — drafted by the AI
 * (or the local assembler) and delivered per NEWSLETTER_AUTOPILOT:
 *
 *   - unset / "draft": issues are created as "ready" for a human to review and
 *     send with one click (the safe default).
 *   - "send": issues are also emailed automatically when RESEND_API_KEY is set.
 *
 * The `autoKey` ("2026-09:credit-repair") makes runs idempotent — retries and
 * manual re-runs never create or send a month's issue twice.
 */

export interface NewsletterSegment {
  track: Track;
  label: string;
  emoji: string;
  /** Article topics researched for this segment's issue. */
  topics: ArticleTopic[];
  /** Seed topic handed to the writer. */
  theme: string;
  audience: Audience;
}

export const NEWSLETTER_SEGMENTS: NewsletterSegment[] = [
  {
    track: "first-time-buyer",
    label: "First-time buyers",
    emoji: "🏠",
    topics: ["first-time-buyer", "cleveland-homebuying", "assistance-programs"],
    theme: "This month on your path to buying your first home",
    audience: { tracks: ["first-time-buyer"] },
  },
  {
    track: "credit-repair",
    label: "Credit repair",
    emoji: "📈",
    topics: ["credit-repair", "fha-counseling"],
    theme: "This month's credit comeback moves",
    audience: { tracks: ["credit-repair"] },
  },
  {
    track: "financial-coaching",
    label: "Financial coaching",
    emoji: "💡",
    topics: ["credit-repair", "assistance-programs"],
    theme: "This month's money moves",
    audience: { tracks: ["financial-coaching"] },
  },
  {
    track: "foreclosure-prevention",
    label: "Foreclosure prevention",
    emoji: "🛡️",
    topics: ["fha-counseling", "seniors-families"],
    theme: "Protecting your home this month",
    audience: { tracks: ["foreclosure-prevention"] },
  },
];

/** "2026-09" for the run's month. */
export function monthKey(date: Date): string {
  return date.toISOString().slice(0, 7);
}

/** "September 2026" for titles. */
export function monthTitle(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function autoKeyFor(date: Date, segment: NewsletterSegment): string {
  return `${monthKey(date)}:${segment.track}`;
}

/** Segments that still need an issue this month, given existing campaigns. */
export function pendingSegments(
  date: Date,
  existing: Pick<Campaign, "autoKey">[],
): NewsletterSegment[] {
  const have = new Set(existing.map((c) => c.autoKey).filter(Boolean));
  return NEWSLETTER_SEGMENTS.filter((s) => !have.has(autoKeyFor(date, s)));
}

export type AutopilotMode = "draft" | "send";

export interface RunOptions {
  date?: Date;
  mode?: AutopilotMode;
  /** Limit the run to these segments (used by the per-segment interactive UI). */
  tracks?: Track[];
  /**
   * "ai" researches fresh articles via web search (the scheduled cron, which
   * has a long budget and no browser waiting). "curated" uses the trusted
   * per-topic library instantly — the interactive button uses this so each
   * request stays comfortably inside serverless time limits.
   */
  articleMode?: "ai" | "curated";
}

/** The segments a run covers, honoring the optional track filter. */
export function selectSegments(tracks?: Track[]): NewsletterSegment[] {
  if (!tracks?.length) return NEWSLETTER_SEGMENTS;
  return NEWSLETTER_SEGMENTS.filter((s) => tracks.includes(s.track));
}

export function autopilotMode(): AutopilotMode {
  return process.env.NEWSLETTER_AUTOPILOT === "send" ? "send" : "draft";
}

export interface SegmentRunResult {
  segment: string;
  autoKey: string;
  status: "created" | "sent" | "skipped-existing" | "send-failed";
  campaignId?: string;
  sent?: number;
  reach?: number;
  note?: string;
}

export interface AutomationRunResult {
  month: string;
  mode: AutopilotMode;
  results: SegmentRunResult[];
}

/**
 * Generate (and in "send" mode, deliver) this month's issue for every segment.
 * Idempotent per month via autoKey. Failures in one segment never block the
 * others.
 */
export async function runMonthlyNewsletters(
  user: AuthUser,
  opts: RunOptions = {},
): Promise<AutomationRunResult> {
  // Server-only imports live here so the segment metadata above stays
  // importable from client components.
  const { listCampaigns, createCampaign, resolveAudience } = await import("./store");
  const { draftCampaign, toSponsorProfile } = await import("./agent");
  const { findArticles, curatedArticles } = await import("./articles");
  const { listLenders } = await import("@/lib/lenders/repository");
  const { listParticipants } = await import("@/lib/participants/repository");
  const { dispatchNewsletter } = await import("./dispatch");
  const { isEmailConfigured } = await import("@/lib/email/mailer");

  const date = opts.date ?? new Date();
  const mode = opts.mode ?? autopilotMode();
  const existing = await listCampaigns();
  const todo = pendingSegments(date, existing);
  const results: SegmentRunResult[] = [];

  for (const s of selectSegments(opts.tracks)) {
    const key = autoKeyFor(date, s);
    if (!todo.includes(s)) {
      results.push({ segment: s.label, autoKey: key, status: "skipped-existing" });
      continue;
    }

    try {
      // Segment-matched reading + the current featured/advertising partners.
      const [articles, lenders, participants] = await Promise.all([
        opts.articleMode === "curated"
          ? Promise.resolve({ articles: curatedArticles(s.topics), source: "curated" as const })
          : findArticles(s.topics).catch(() => ({ articles: [], source: "curated" as const })),
        listLenders().catch(() => []),
        listParticipants(user).catch(() => []),
      ]);
      const sponsors = lenders
        .filter((l) => l.active && (l.tier === "featured" || l.advertising))
        .slice(0, 2)
        .map(toSponsorProfile);

      const draft = await draftCampaign({
        type: "newsletter",
        topic: `${s.theme} — ${monthTitle(date)}`,
        audience: s.audience,
        language: "en",
        sources: articles.articles.slice(0, 5),
        sponsors,
      });

      const campaign = await createCampaign({
        type: "newsletter",
        title: `${s.emoji} ${monthTitle(date)} — ${s.label}`,
        subject: draft.subject,
        audience: s.audience,
        language: "en",
        bodyMarkdown: draft.bodyMarkdown,
        design: draft.design,
        status: "ready",
        draftedBy: draft.source === "ai" ? draft.model : "monthly automation",
        autoKey: key,
      });

      const reach = resolveAudience(s.audience, participants).emailable;

      if (mode === "send" && isEmailConfigured() && reach > 0) {
        try {
          const sent = await dispatchNewsletter(user, campaign);
          results.push({
            segment: s.label,
            autoKey: key,
            status: "sent",
            campaignId: campaign.id,
            sent: sent.sent,
            reach,
          });
        } catch (e) {
          results.push({
            segment: s.label,
            autoKey: key,
            status: "send-failed",
            campaignId: campaign.id,
            reach,
            note: e instanceof Error ? e.message : "send failed",
          });
        }
      } else {
        results.push({
          segment: s.label,
          autoKey: key,
          status: "created",
          campaignId: campaign.id,
          reach,
          note:
            mode === "send" && !isEmailConfigured()
              ? "Ready for review — set RESEND_API_KEY to auto-send."
              : undefined,
        });
      }
    } catch (e) {
      results.push({
        segment: s.label,
        autoKey: key,
        status: "send-failed",
        note: e instanceof Error ? e.message : "generation failed",
      });
    }
  }

  return { month: monthKey(date), mode, results };
}

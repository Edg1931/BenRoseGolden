import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/session";
import { listContent, listCampaigns, resolveAudience } from "@/lib/content/store";
import { listParticipants } from "@/lib/participants/repository";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ContentLibrary } from "@/components/content/content-library";
import { MODULE_DAY } from "@/lib/learn/quiz";
import { NEWSLETTER_SEGMENTS, autoKeyFor, autopilotMode, monthTitle } from "@/lib/content/automation";
import { AutomationRunButton } from "@/components/content/automation-panel";
import { isEmailConfigured } from "@/lib/email/mailer";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ContentPage() {
  const user = await getCurrentUser();
  const participants = await listParticipants(user);
  const content = listContent();
  const campaigns = (await listCampaigns()).map((c) => {
    const resolved = resolveAudience(c.audience, participants);
    return { ...c, reach: resolved.total, emailable: resolved.emailable };
  });

  const now = new Date();
  const mode = autopilotMode();
  const segments = NEWSLETTER_SEGMENTS.map((seg) => {
    const resolved = resolveAudience(seg.audience, participants);
    const issue = campaigns.find((c) => c.autoKey === autoKeyFor(now, seg));
    return { seg, emailable: resolved.emailable, total: resolved.total, issue };
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Content &amp; Marketing</h1>
          <p className="text-sm text-muted-foreground">
            Multi-format, multi-language learning content and AI-drafted newsletters &amp; flyers.
          </p>
        </div>
        <Link href="/content/compose" className="rounded-md bg-brand-rose px-3 py-2 text-sm font-medium text-white">
          ✨ Compose with AI
        </Link>
      </div>

      {/* Monthly automation */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Monthly newsletter automation
        </h2>
        <Card className="grid gap-5 p-5 lg:grid-cols-[1fr_18rem]">
          <div>
            <p className="text-sm text-foreground/90">
              On the <strong>1st of every month</strong>, each audience segment gets its own designed
              issue — segment-matched articles, live assistance data, and current featured partners.
              Clients are bunched by their <strong>needs tags</strong> (set at sign-up, intake, or on
              their profile).{" "}
              {mode === "send" ? (
                <span className="font-medium text-emerald-700">
                  Autopilot: issues send automatically{isEmailConfigured() ? "" : " once RESEND_API_KEY is set"}.
                </span>
              ) : (
                <span className="font-medium text-brand-goldink">
                  Review mode: issues arrive as “ready” for one-click send (set NEWSLETTER_AUTOPILOT=send for full autopilot).
                </span>
              )}
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {segments.map(({ seg, emailable, total, issue }) => (
                <div key={seg.track} className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm">
                  <span>
                    {seg.emoji} <span className="font-medium">{seg.label}</span>
                    <span className="ml-1.5 text-xs text-muted-foreground">{total} tagged · {emailable} emailable</span>
                  </span>
                  {issue ? (
                    <Link href={`/content/campaigns/${issue.id}`} className="text-xs font-medium text-brand-rose hover:underline">
                      {issue.status === "sent" ? "✅ sent" : "📝 ready"} →
                    </Link>
                  ) : (
                    <span className="text-xs text-muted-foreground">due {monthTitle(now)}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <AutomationRunButton segments={NEWSLETTER_SEGMENTS.map((s) => ({ track: s.track, label: s.label, emoji: s.emoji }))} />
            <p className="text-xs text-muted-foreground">
              Safe to press any time — a month&apos;s issue is never generated or sent twice.
            </p>
          </div>
        </Card>
      </section>

      {/* Campaigns */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Campaigns</h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((c) => (
            <Link key={c.id} href={`/content/campaigns/${c.id}`}>
              <Card className="flex h-full flex-col gap-2 p-4 transition hover:border-brand-rose hover:shadow-md">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-medium leading-tight">{c.title}</h3>
                  <Badge variant={c.status === "sent" ? "success" : c.status === "ready" ? "gold" : "muted"}>
                    {c.status}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-1 text-xs">
                  <Badge variant="rose">{c.type}</Badge>
                  <Badge variant="muted">reaches {c.reach}</Badge>
                  {c.emailable > 0 && <Badge variant="muted">{c.emailable} emailable</Badge>}
                </div>
                {c.subject && <p className="text-xs text-muted-foreground">{c.subject}</p>}
                <div className="mt-auto">
                  {c.status === "sent" ? (
                    <p className="text-xs text-emerald-700">
                      ✅ Sent{c.sentCount != null ? ` to ${c.sentCount}` : ""}
                      {c.sentAt ? ` · ${formatDate(c.sentAt)}` : ""}
                    </p>
                  ) : (
                    <span className="text-sm font-medium text-brand-rose">Open &amp; preview →</span>
                  )}
                </div>
              </Card>
            </Link>
          ))}
          {campaigns.length === 0 && (
            <p className="text-sm text-muted-foreground">No campaigns yet — compose your first one.</p>
          )}
        </div>
      </section>

      {/* Content library */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Content library</h2>
        <ContentLibrary items={content} moduleDay={MODULE_DAY} />
      </section>
    </div>
  );
}

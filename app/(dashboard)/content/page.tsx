import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/session";
import { listContent, listCampaigns, resolveAudience } from "@/lib/content/store";
import { listParticipants } from "@/lib/participants/repository";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ContentLibrary } from "@/components/content/content-library";
import { SendCampaign } from "@/components/content/send-campaign";
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

      {/* Campaigns */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Campaigns</h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((c) => (
            <Card key={c.id} className="space-y-2 p-4">
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
              {c.status === "sent" ? (
                <p className="text-xs text-emerald-700">
                  ✅ Sent{c.sentCount != null ? ` to ${c.sentCount}` : ""}
                  {c.sentAt ? ` · ${formatDate(c.sentAt)}` : ""}
                </p>
              ) : (
                c.type === "newsletter" && (
                  <SendCampaign campaignId={c.id} emailable={c.emailable} />
                )
              )}
            </Card>
          ))}
          {campaigns.length === 0 && (
            <p className="text-sm text-muted-foreground">No campaigns yet — compose your first one.</p>
          )}
        </div>
      </section>

      {/* Content library */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Content library</h2>
        <ContentLibrary items={content} />
      </section>
    </div>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { getCampaign, resolveAudience } from "@/lib/content/store";
import { listParticipants } from "@/lib/participants/repository";
import { LANGUAGE_LABELS } from "@/lib/participants/curriculum";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Markdown } from "@/components/content/markdown";
import { SendCampaign } from "@/components/content/send-campaign";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function CampaignDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  const campaign = await getCampaign(id);
  if (!campaign) notFound();

  const participants = await listParticipants(user);
  const audience = resolveAudience(campaign.audience, participants);

  return (
    <div className="space-y-5">
      <div>
        <Link href="/content" className="text-sm text-muted-foreground hover:underline">← Back to content</Link>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <h1 className="text-xl font-semibold tracking-tight">{campaign.title}</h1>
          <Badge variant={campaign.status === "sent" ? "success" : campaign.status === "ready" ? "gold" : "muted"}>{campaign.status}</Badge>
          <Badge variant="rose">{campaign.type}</Badge>
          <Badge variant="muted">{LANGUAGE_LABELS[campaign.language]}</Badge>
        </div>
        {campaign.subject && <p className="mt-1 text-sm text-muted-foreground">Subject: {campaign.subject}</p>}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* The actual rendered newsletter/flyer */}
        <Card className="lg:col-span-2 p-6">
          <div className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">Preview</div>
          <div className="rounded-lg border border-border bg-white p-6">
            <Markdown source={campaign.bodyMarkdown || "_No content yet._"} />
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="space-y-2 p-4">
            <h2 className="text-sm font-semibold">Audience</h2>
            <Row label="Reaches" value={String(audience.total)} />
            <Row label="Emailable" value={String(audience.emailable)} />
            {campaign.audience.stages?.length ? <Row label="Stages" value={campaign.audience.stages.join(", ")} /> : null}
            {campaign.audience.tracks?.length ? <Row label="Tracks" value={campaign.audience.tracks.join(", ")} /> : null}
            {campaign.audience.language ? <Row label="Language" value={LANGUAGE_LABELS[campaign.audience.language]} /> : null}
          </Card>

          <Card className="space-y-3 p-4">
            <h2 className="text-sm font-semibold">Send</h2>
            {campaign.status === "sent" ? (
              <p className="text-sm text-emerald-700">
                ✅ Sent{campaign.sentCount != null ? ` to ${campaign.sentCount}` : ""}
                {campaign.sentAt ? ` on ${formatDate(campaign.sentAt)}` : ""}
              </p>
            ) : campaign.type === "newsletter" ? (
              <SendCampaign campaignId={campaign.id} emailable={audience.emailable} />
            ) : (
              <p className="text-sm text-muted-foreground">Flyers are downloaded/printed rather than emailed.</p>
            )}
          </Card>

          <Card className="space-y-1 p-4 text-xs text-muted-foreground">
            {campaign.draftedBy && <div>Drafted by {campaign.draftedBy}</div>}
            <div>Updated {formatDate(campaign.updatedAt)}</div>
          </Card>

          <Link href="/content/compose" className="block rounded-md border border-input px-3 py-2 text-center text-sm hover:bg-muted">
            ✨ Compose another
          </Link>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

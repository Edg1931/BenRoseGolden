import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getCurrentUser } from "@/lib/auth/session";
import { getCampaign, resolveAudience, updateCampaign } from "@/lib/content/store";
import { recordSends } from "@/lib/content/sends";
import { listParticipants, updateParticipant } from "@/lib/participants/repository";
import { isEmailConfigured, markdownToBasicHtml, sendEmail } from "@/lib/email/mailer";
import { renderNewsletterHtml, renderNewsletterText } from "@/lib/content/newsletter";
import type { Communication, Participant } from "@/lib/participants/schema";

/**
 * Send a newsletter campaign to its targeted audience. Resolves the audience to
 * emailable participants, delivers via the configured provider, writes a
 * per-recipient sent-log, logs the send on each participant's timeline, and
 * marks the campaign sent. Refuses (422) when no email provider is configured.
 */
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const user = await getCurrentUser();
  try {
    const campaign = await getCampaign(id);
    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }
    if (campaign.type !== "newsletter") {
      return NextResponse.json(
        { error: "Only newsletters can be emailed. Flyers are downloadable assets." },
        { status: 400 },
      );
    }

    const participants = await listParticipants(user);
    const { reachable } = resolveAudience(campaign.audience, participants);
    const recipients = reachable.filter(
      (p) =>
        !!p.email &&
        (p.contactChannels.length === 0 || p.contactChannels.includes("email")),
    );

    if (recipients.length === 0) {
      return NextResponse.json(
        { error: "No emailable recipients match this audience." },
        { status: 400 },
      );
    }

    if (!isEmailConfigured()) {
      return NextResponse.json(
        {
          error: "Email provider not configured. Set RESEND_API_KEY to send.",
          wouldReach: recipients.length,
        },
        { status: 422 },
      );
    }

    const subject = campaign.subject ?? campaign.title;
    // Designed newsletters send the branded email; legacy campaigns fall back
    // to basic markdown HTML. Both carry a plain-text alternative.
    const html = campaign.design
      ? renderNewsletterHtml(campaign.design, { siteUrl: process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL })
      : markdownToBasicHtml(campaign.bodyMarkdown);
    const text = campaign.design
      ? renderNewsletterText(campaign.design)
      : campaign.bodyMarkdown;
    const sentDate = new Date().toISOString().slice(0, 10);

    const logEntries: Parameters<typeof recordSends>[0] = [];
    const emailedParticipants: Participant[] = [];

    for (const p of recipients) {
      try {
        await sendEmail({ to: p.email!, subject, text, html });
        logEntries.push({ campaignId: campaign.id, participantId: p.id, email: p.email!, status: "sent" });
        emailedParticipants.push(p);
      } catch (e) {
        logEntries.push({
          campaignId: campaign.id,
          participantId: p.id,
          email: p.email!,
          status: "failed",
          error: e instanceof Error ? e.message : "send failed",
        });
      }
    }

    await recordSends(logEntries);

    // Log the newsletter on each reached participant's timeline (best-effort).
    await Promise.all(
      emailedParticipants.map((p) => {
        const entry: Communication = {
          id: randomUUID(),
          date: sentDate,
          channel: "email",
          direction: "outbound",
          subject: `Newsletter: ${campaign.title}`,
          body: subject,
          byUser: user.name ?? user.email,
        };
        return updateParticipant(user, p.id, {
          communications: [...p.communications, entry],
        }).catch(() => undefined);
      }),
    );

    const sent = logEntries.filter((e) => e.status === "sent").length;
    const failed = logEntries.filter((e) => e.status === "failed").length;

    const updated = await updateCampaign(campaign.id, {
      status: "sent",
      sentAt: new Date().toISOString(),
      sentCount: sent,
    });

    return NextResponse.json({ sent, failed, wouldReach: recipients.length, campaign: updated });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid request";
    const status = message.includes("not found") ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}

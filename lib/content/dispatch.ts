import { randomUUID } from "crypto";
import type { AuthUser } from "@/lib/auth/roles";
import { listParticipants, updateParticipant } from "@/lib/participants/repository";
import type { Communication, Participant } from "@/lib/participants/schema";
import { isEmailConfigured, markdownToBasicHtml, sendEmail } from "@/lib/email/mailer";
import { renderNewsletterHtml, renderNewsletterText } from "./newsletter";
import { recordSends } from "./sends";
import { resolveAudience, updateCampaign } from "./store";
import type { Campaign } from "./schema";

/**
 * Newsletter delivery, shared by the manual "Send" button and the monthly
 * automation: resolves the campaign's audience to emailable participants,
 * sends the designed HTML (with a plain-text alternative), writes the
 * per-recipient send log, notes the send on each participant's timeline, and
 * marks the campaign sent.
 */

export interface DispatchResult {
  sent: number;
  failed: number;
  wouldReach: number;
  campaign: Campaign;
}

export class DispatchError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly wouldReach?: number,
  ) {
    super(message);
  }
}

export async function dispatchNewsletter(
  user: AuthUser,
  campaign: Campaign,
): Promise<DispatchResult> {
  if (campaign.type !== "newsletter") {
    throw new DispatchError("Only newsletters can be emailed.", 400);
  }

  const participants = await listParticipants(user);
  const { reachable } = resolveAudience(campaign.audience, participants);
  const recipients = reachable.filter(
    (p) =>
      !!p.email &&
      (p.contactChannels.length === 0 || p.contactChannels.includes("email")),
  );

  if (recipients.length === 0) {
    throw new DispatchError("No emailable recipients match this audience.", 400);
  }
  if (!isEmailConfigured()) {
    throw new DispatchError(
      "Email provider not configured. Set RESEND_API_KEY to send.",
      422,
      recipients.length,
    );
  }

  const subject = campaign.subject ?? campaign.title;
  const siteUrl = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL;
  const html = campaign.design
    ? renderNewsletterHtml(campaign.design, { siteUrl })
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
      logEntries.push({
        campaignId: campaign.id,
        participantId: p.id,
        email: p.email!,
        status: "sent",
      });
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

  return { sent, failed, wouldReach: recipients.length, campaign: updated };
}

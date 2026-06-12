import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getCurrentUser } from "@/lib/auth/session";
import { getParticipant, updateParticipant } from "@/lib/participants/repository";
import { listContent } from "@/lib/content/store";
import { preferredChannel } from "@/lib/content/delivery";
import { isEmailConfigured, sendEmail } from "@/lib/email/mailer";
import { CONTENT_FORMAT_LABELS, LANGUAGE_LABELS } from "@/lib/participants/curriculum";
import type { Communication } from "@/lib/participants/schema";

/**
 * "Send content" — hand a curated learning asset to a participant in their
 * preferred format/language and log it to their timeline. When the asset is
 * emailed and a provider is configured, it's actually delivered; otherwise the
 * delivery is still recorded so staff can follow up by their chosen channel.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const user = await getCurrentUser();
  try {
    const { contentId, channel: requestedChannel } = (await request.json()) as {
      contentId?: string;
      channel?: Communication["channel"];
    };
    if (!contentId) {
      return NextResponse.json({ error: "contentId is required" }, { status: 400 });
    }

    const participant = await getParticipant(user, id);
    if (!participant) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const item = listContent().find((c) => c.id === contentId);
    if (!item) {
      return NextResponse.json({ error: "Content not found" }, { status: 404 });
    }

    const channel = requestedChannel ?? preferredChannel(participant);
    const descriptor = `${CONTENT_FORMAT_LABELS[item.format]} · ${LANGUAGE_LABELS[item.language]}`;

    // Actually deliver by email when possible; otherwise just record it.
    let emailed = false;
    let emailError: string | undefined;
    if (channel === "email" && participant.email && isEmailConfigured()) {
      try {
        await sendEmail({
          to: participant.email,
          subject: item.title,
          text: `${item.summary}\n\n${item.url ?? ""}`.trim(),
          html: `<p>${item.summary}</p>${item.url ? `<p><a href="${item.url}">Open the ${CONTENT_FORMAT_LABELS[item.format]}</a></p>` : ""}`,
        });
        emailed = true;
      } catch (e) {
        emailError = e instanceof Error ? e.message : "Email send failed";
      }
    }

    const entry: Communication = {
      id: randomUUID(),
      date: new Date().toISOString().slice(0, 10),
      channel,
      direction: "outbound",
      subject: `Sent: ${item.title}`,
      body: `${descriptor}${item.url ? ` — ${item.url}` : ""}${
        emailed ? " (emailed)" : channel === "email" && !isEmailConfigured() ? " (logged — add RESEND_API_KEY to email automatically)" : ""
      }`,
      byUser: user.name ?? user.email,
    };

    const updated = await updateParticipant(user, id, {
      communications: [...participant.communications, entry],
    });

    return NextResponse.json({ emailed, emailError, channel, participant: updated });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid request";
    const status = message.includes("not found") ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}

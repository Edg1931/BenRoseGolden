/**
 * Minimal email provider abstraction. Uses Resend's REST API directly (no SDK
 * dependency) so a "ready" newsletter or a content hand-off can actually be
 * delivered once RESEND_API_KEY is set. Until then `isEmailConfigured()` is
 * false and callers surface a "add a key to send" message instead of pretending.
 */

const RESEND_ENDPOINT = "https://api.resend.com/emails";

const DEFAULT_FROM = "Benjamin Rose Housing <onboarding@resend.dev>";

export function emailConfig() {
  return {
    apiKey: process.env.RESEND_API_KEY,
    from: process.env.EMAIL_FROM ?? DEFAULT_FROM,
  };
}

export function isEmailConfigured(): boolean {
  return !!process.env.RESEND_API_KEY;
}

export interface SendEmailInput {
  to: string;
  subject: string;
  html?: string;
  text?: string;
}

export interface SendEmailResult {
  id: string;
}

export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const { apiKey, from } = emailConfig();
  if (!apiKey) {
    throw new Error("Email is not configured — set RESEND_API_KEY to send.");
  }
  const res = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text,
    }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Email send failed (${res.status})${detail ? `: ${detail}` : ""}`);
  }
  const data = (await res.json().catch(() => ({}))) as { id?: string };
  return { id: data.id ?? "unknown" };
}

/**
 * Tiny Markdown→HTML for email bodies — headings, bold, list items, and
 * paragraphs. Intentionally small; campaign copy is short-form.
 */
export function markdownToBasicHtml(md: string): string {
  const escaped = md
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  const lines = escaped.split("\n");
  const out: string[] = [];
  let inList = false;
  const inline = (s: string) =>
    s.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\*(.+?)\*/g, "<em>$1</em>");

  for (const raw of lines) {
    const line = raw.trimEnd();
    const heading = line.match(/^(#{1,3})\s+(.*)$/);
    const bullet = line.match(/^[-*]\s+(.*)$/);
    if (heading) {
      if (inList) { out.push("</ul>"); inList = false; }
      const level = heading[1].length;
      out.push(`<h${level}>${inline(heading[2])}</h${level}>`);
    } else if (bullet) {
      if (!inList) { out.push("<ul>"); inList = true; }
      out.push(`<li>${inline(bullet[1])}</li>`);
    } else if (line.trim() === "") {
      if (inList) { out.push("</ul>"); inList = false; }
    } else {
      if (inList) { out.push("</ul>"); inList = false; }
      out.push(`<p>${inline(line)}</p>`);
    }
  }
  if (inList) out.push("</ul>");
  return out.join("\n");
}

import { z } from "zod";

/**
 * Designed newsletters.
 *
 * A newsletter is a structured document of sections — not a wall of Markdown —
 * so the AI can compose it from the site's real content (classes, assistance
 * programs, partner lenders) and the renderer can make it *look* like Benjamin
 * Rose: the same rose/plum/gold/blush palette as the site, big stat graphics,
 * program cards, and partner spotlights.
 *
 * The renderer emits EMAIL-SAFE HTML: table layout, inline styles, no external
 * images/fonts/scripts — the graphics are built from colored blocks and type,
 * so they render identically in Gmail/Outlook/Apple Mail and in the in-app
 * preview. Every send carries the Equal Housing note and, when partners are
 * featured, a partner disclosure.
 */

/* ── Brand palette (hex equivalents of the site's HSL tokens) ─────────────── */
const BRAND = {
  rose: "#D8183B",
  plum: "#891A2E",
  gold: "#F5800A",
  goldInk: "#934D06",
  blush: "#FFEBEF",
  cream: "#FDF9F7",
  ink: "#2A1C1F",
  inkSoft: "#5C4A4D",
  line: "#F0DFE3",
  white: "#FFFFFF",
};

/* ── Section schemas ──────────────────────────────────────────────────────── */

const ctaSchema = z.object({ label: z.string(), url: z.string() });

export const heroSectionSchema = z.object({
  kind: z.literal("hero"),
  kicker: z.string().optional(),
  headline: z.string(),
  intro: z.string(),
});

export const articleSectionSchema = z.object({
  kind: z.literal("article"),
  emoji: z.string().optional(),
  title: z.string(),
  paragraphs: z.array(z.string()).min(1),
  cta: ctaSchema.optional(),
});

/** A big-number graphic — the visual anchor of the issue. */
export const statSectionSchema = z.object({
  kind: z.literal("stat"),
  value: z.string(),
  label: z.string(),
  caption: z.string().optional(),
});

export const checklistSectionSchema = z.object({
  kind: z.literal("checklist"),
  title: z.string(),
  items: z.array(z.string()).min(1),
});

/** A down-payment-assistance program card, from the live program database. */
export const programSectionSchema = z.object({
  kind: z.literal("program"),
  name: z.string(),
  provider: z.string(),
  amount: z.string(),
  blurb: z.string(),
  url: z.string().optional(),
});

/** The classes call-to-action band. */
export const classCtaSectionSchema = z.object({
  kind: z.literal("classCta"),
  title: z.string(),
  body: z.string(),
  buttonLabel: z.string(),
  url: z.string(),
});

/** A partner/lender spotlight — the advertising slot, clearly labeled. */
export const sponsorSectionSchema = z.object({
  kind: z.literal("sponsor"),
  institutionName: z.string(),
  contactName: z.string().optional(),
  tierLabel: z.string().default("Featured partner"),
  blurb: z.string(),
  offers: z
    .array(z.object({ name: z.string(), amount: z.string().optional() }))
    .default([]),
  website: z.string().optional(),
});

export const quoteSectionSchema = z.object({
  kind: z.literal("quote"),
  text: z.string(),
  attribution: z.string(),
});

export const newsletterSectionSchema = z.discriminatedUnion("kind", [
  heroSectionSchema,
  articleSectionSchema,
  statSectionSchema,
  checklistSectionSchema,
  programSectionSchema,
  classCtaSectionSchema,
  sponsorSectionSchema,
  quoteSectionSchema,
]);
export type NewsletterSection = z.infer<typeof newsletterSectionSchema>;

export const newsletterDocSchema = z.object({
  subject: z.string(),
  /** Inbox preview snippet (the grey text after the subject). */
  preheader: z.string().optional(),
  sections: z.array(newsletterSectionSchema).min(1),
});
export type NewsletterDoc = z.infer<typeof newsletterDocSchema>;

/* ── HTML helpers ─────────────────────────────────────────────────────────── */

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const FONT =
  "'Segoe UI', -apple-system, Helvetica, Arial, sans-serif";
const SERIF = "Georgia, 'Times New Roman', serif";

function button(label: string, url: string, bg = BRAND.rose): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:18px auto 0"><tr><td style="border-radius:8px;background:${bg}"><a href="${esc(url)}" style="display:inline-block;padding:13px 30px;font-family:${FONT};font-size:15px;font-weight:700;color:#FFFFFF;text-decoration:none;border-radius:8px">${esc(label)}</a></td></tr></table>`;
}

function pad(inner: string, padding = "28px 32px", bg = BRAND.white): string {
  return `<tr><td style="padding:${padding};background:${bg}">${inner}</td></tr>`;
}

/* ── Section renderers ────────────────────────────────────────────────────── */

function renderSection(s: NewsletterSection): string {
  switch (s.kind) {
    case "hero":
      return pad(
        `${s.kicker ? `<p style="margin:0 0 10px;font-family:${FONT};font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${BRAND.gold}">${esc(s.kicker)}</p>` : ""}
         <h1 style="margin:0 0 14px;font-family:${SERIF};font-size:30px;line-height:1.15;color:#FFFFFF">${esc(s.headline)}</h1>
         <p style="margin:0;font-family:${FONT};font-size:16px;line-height:1.6;color:#FFE3E9">${esc(s.intro)}</p>`,
        "36px 32px",
        BRAND.plum,
      );

    case "article":
      return pad(
        `<h2 style="margin:0 0 12px;font-family:${SERIF};font-size:22px;line-height:1.25;color:${BRAND.plum}">${s.emoji ? esc(s.emoji) + " " : ""}${esc(s.title)}</h2>
         ${s.paragraphs
           .map(
             (p) =>
               `<p style="margin:0 0 12px;font-family:${FONT};font-size:15px;line-height:1.65;color:${BRAND.ink}">${esc(p)}</p>`,
           )
           .join("")}
         ${s.cta ? `<p style="margin:6px 0 0"><a href="${esc(s.cta.url)}" style="font-family:${FONT};font-size:15px;font-weight:700;color:${BRAND.rose};text-decoration:none">${esc(s.cta.label)} →</a></p>` : ""}`,
      );

    case "stat":
      return pad(
        `<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
           <td align="center" style="background:${BRAND.blush};border-radius:14px;padding:28px 20px">
             <div style="font-family:${SERIF};font-size:52px;line-height:1;font-weight:700;color:${BRAND.rose}">${esc(s.value)}</div>
             <div style="margin-top:8px;font-family:${FONT};font-size:15px;font-weight:700;color:${BRAND.plum}">${esc(s.label)}</div>
             ${s.caption ? `<div style="margin-top:6px;font-family:${FONT};font-size:13px;color:${BRAND.inkSoft}">${esc(s.caption)}</div>` : ""}
           </td>
         </tr></table>`,
        "10px 32px",
      );

    case "checklist":
      return pad(
        `<h2 style="margin:0 0 14px;font-family:${SERIF};font-size:20px;color:${BRAND.plum}">${esc(s.title)}</h2>
         <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${s.items
           .map(
             (item) =>
               `<tr><td width="28" valign="top" style="font-family:${FONT};font-size:15px;line-height:1.7;color:${BRAND.gold};font-weight:700">✓</td><td style="font-family:${FONT};font-size:15px;line-height:1.7;color:${BRAND.ink};padding-bottom:6px">${esc(item)}</td></tr>`,
           )
           .join("")}</table>`,
      );

    case "program":
      return pad(
        `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:2px solid ${BRAND.line};border-left:6px solid ${BRAND.rose};border-radius:10px"><tr><td style="padding:20px 22px">
           <p style="margin:0 0 4px;font-family:${FONT};font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:${BRAND.rose}">Assistance spotlight</p>
           <h3 style="margin:0 0 4px;font-family:${SERIF};font-size:19px;color:${BRAND.ink}">${esc(s.name)}</h3>
           <p style="margin:0 0 10px;font-family:${FONT};font-size:13px;color:${BRAND.inkSoft}">${esc(s.provider)} · <strong style="color:${BRAND.goldInk}">${esc(s.amount)}</strong></p>
           <p style="margin:0;font-family:${FONT};font-size:14px;line-height:1.6;color:${BRAND.ink}">${esc(s.blurb)}</p>
           ${s.url ? `<p style="margin:10px 0 0"><a href="${esc(s.url)}" style="font-family:${FONT};font-size:14px;font-weight:700;color:${BRAND.rose};text-decoration:none">See if you qualify →</a></p>` : ""}
         </td></tr></table>`,
        "10px 32px",
      );

    case "classCta":
      return pad(
        `<h2 style="margin:0 0 10px;font-family:${SERIF};font-size:22px;color:#FFFFFF">${esc(s.title)}</h2>
         <p style="margin:0;font-family:${FONT};font-size:15px;line-height:1.6;color:#FFE9D6">${esc(s.body)}</p>
         ${button(s.buttonLabel, s.url, BRAND.plum)}`,
        "30px 32px",
        BRAND.gold,
      );

    case "sponsor":
      return pad(
        `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.cream};border:2px solid ${BRAND.line};border-radius:10px"><tr><td style="padding:20px 22px">
           <p style="margin:0 0 6px;font-family:${FONT};font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:${BRAND.goldInk}">${esc(s.tierLabel)}</p>
           <h3 style="margin:0 0 6px;font-family:${SERIF};font-size:19px;color:${BRAND.ink}">${esc(s.institutionName)}${s.contactName ? ` <span style="font-family:${FONT};font-size:13px;font-weight:400;color:${BRAND.inkSoft}">· ${esc(s.contactName)}</span>` : ""}</h3>
           <p style="margin:0 0 ${s.offers.length ? "12px" : "0"};font-family:${FONT};font-size:14px;line-height:1.6;color:${BRAND.ink}">${esc(s.blurb)}</p>
           ${s.offers
             .map(
               (o) =>
                 `<p style="margin:0 0 4px;font-family:${FONT};font-size:13px;color:${BRAND.ink}">🏷️ <strong>${esc(o.name)}</strong>${o.amount ? ` — <span style="color:${BRAND.goldInk};font-weight:700">${esc(o.amount)}</span>` : ""}</p>`,
             )
             .join("")}
           ${s.website ? `<p style="margin:10px 0 0"><a href="${esc(s.website)}" style="font-family:${FONT};font-size:13px;font-weight:700;color:${BRAND.rose};text-decoration:none">Visit ${esc(s.institutionName)} →</a></p>` : ""}
         </td></tr></table>`,
        "10px 32px",
      );

    case "quote":
      return pad(
        `<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
           <td style="border-left:4px solid ${BRAND.gold};padding:4px 0 4px 18px">
             <p style="margin:0 0 8px;font-family:${SERIF};font-size:18px;line-height:1.5;font-style:italic;color:${BRAND.plum}">“${esc(s.text)}”</p>
             <p style="margin:0;font-family:${FONT};font-size:13px;font-weight:700;color:${BRAND.inkSoft}">— ${esc(s.attribution)}</p>
           </td>
         </tr></table>`,
      );
  }
}

/* ── Document renderer ────────────────────────────────────────────────────── */

export interface RenderOptions {
  /** Absolute origin for links like /learn (defaults to a placeholder host). */
  siteUrl?: string;
}

/** Render the full email-safe HTML document for a designed newsletter. */
export function renderNewsletterHtml(
  doc: NewsletterDoc,
  opts: RenderOptions = {},
): string {
  const hasSponsors = doc.sections.some((s) => s.kind === "sponsor");
  const site = opts.siteUrl?.replace(/\/$/, "");

  const absolutize = (html: string) =>
    site ? html.replace(/href="\//g, `href="${site}/`) : html;

  const body = doc.sections.map(renderSection).join("\n");

  const footer = pad(
    `<p style="margin:0 0 8px;font-family:${SERIF};font-size:16px;color:#FFFFFF"><strong>Benjamin Rose</strong> <span style="color:#E8A9B4">× The Golden Group</span></p>
     <p style="margin:0 0 10px;font-family:${FONT};font-size:12px;line-height:1.6;color:#E8A9B4">Free, HUD-approved homebuyer education, foreclosure prevention, and credit coaching — in your language. This newsletter was sent to you as a Benjamin Rose program participant. Reply to this email or call your counselor to change how we contact you.</p>
     ${hasSponsors ? `<p style="margin:0 0 10px;font-family:${FONT};font-size:11px;line-height:1.6;color:#D89AA6">Partner spotlights describe offers from participating lenders. Benjamin Rose does not endorse a specific lender, and you are never required to use a partner to take our classes or receive counseling. Compare offers before you choose.</p>` : ""}
     <p style="margin:0;font-family:${FONT};font-size:11px;color:#D89AA6">🏠 Equal Housing Opportunity</p>`,
    "26px 32px",
    BRAND.plum,
  );

  const preheader = doc.preheader
    ? `<div style="display:none;max-height:0;overflow:hidden;mso-hide:all">${esc(doc.preheader)}</div>`
    : "";

  return absolutize(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(doc.subject)}</title>
</head>
<body style="margin:0;padding:0;background:${BRAND.cream}">
${preheader}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.cream}"><tr><td align="center" style="padding:24px 12px">
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:100%;border-radius:14px;overflow:hidden;border:1px solid ${BRAND.line}">
    ${pad(`<p style="margin:0;font-family:${SERIF};font-size:18px;color:${BRAND.plum}"><strong>Benjamin Rose</strong> <span style="font-family:${FONT};font-size:12px;color:${BRAND.inkSoft}">HOUSING</span></p>`, "18px 32px", BRAND.white)}
    ${body}
    ${footer}
  </table>
</td></tr></table>
</body>
</html>`);
}

/** Plain-text fallback (for the email `text` part and quick previews). */
export function renderNewsletterText(doc: NewsletterDoc): string {
  const lines: string[] = [];
  for (const s of doc.sections) {
    switch (s.kind) {
      case "hero":
        lines.push(s.headline.toUpperCase(), "", s.intro);
        break;
      case "article":
        lines.push("", `${s.emoji ? s.emoji + " " : ""}${s.title}`, ...s.paragraphs);
        if (s.cta) lines.push(`${s.cta.label}: ${s.cta.url}`);
        break;
      case "stat":
        lines.push("", `${s.value} — ${s.label}${s.caption ? ` (${s.caption})` : ""}`);
        break;
      case "checklist":
        lines.push("", s.title, ...s.items.map((i) => `  ✓ ${i}`));
        break;
      case "program":
        lines.push("", `ASSISTANCE SPOTLIGHT: ${s.name} (${s.provider}) — ${s.amount}`, s.blurb);
        if (s.url) lines.push(`See if you qualify: ${s.url}`);
        break;
      case "classCta":
        lines.push("", s.title, s.body, `${s.buttonLabel}: ${s.url}`);
        break;
      case "sponsor":
        lines.push("", `${s.tierLabel.toUpperCase()}: ${s.institutionName}`, s.blurb);
        for (const o of s.offers) lines.push(`  🏷 ${o.name}${o.amount ? ` — ${o.amount}` : ""}`);
        break;
      case "quote":
        lines.push("", `“${s.text}” — ${s.attribution}`);
        break;
    }
  }
  lines.push(
    "",
    "Benjamin Rose × The Golden Group — Equal Housing Opportunity.",
  );
  return lines.join("\n").trim();
}

/** Markdown-ish body for the editable text area (kept in sync with design). */
export function newsletterToMarkdown(doc: NewsletterDoc): string {
  return renderNewsletterText(doc);
}

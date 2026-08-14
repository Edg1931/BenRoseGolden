import type { NewsletterDoc } from "./newsletter";

/**
 * Social flyers — square 1080×1080 graphics derived from a designed newsletter,
 * sized for Instagram/Facebook posts.
 *
 * Each card is generated as self-contained inline-styled XHTML in the brand
 * palette, so the SAME markup renders the on-screen preview and rasterizes to a
 * PNG client-side (SVG foreignObject → canvas) with no external assets, fonts,
 * or services. Every card carries the Benjamin Rose footer bar and the Equal
 * Housing mark.
 */

const BRAND = {
  rose: "#D8183B",
  plum: "#891A2E",
  gold: "#F5800A",
  blush: "#FFEBEF",
  cream: "#FDF9F7",
  ink: "#2A1C1F",
  inkSoft: "#5C4A4D",
  white: "#FFFFFF",
};

const SERIF = "Georgia, 'Times New Roman', serif";
const SANS = "Arial, Helvetica, sans-serif";

export interface SocialCard {
  id: string;
  /** Shown to staff as the card's name. */
  label: string;
  /** Self-contained 1080×1080 XHTML (inline styles only). */
  html: string;
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** The shared footer band: brand + Equal Housing. */
type FooterTone = "onPlum" | "onLight" | "onGold";
function footerBar(tone: FooterTone): string {
  // Every pairing clears WCAG contrast on its background: white/#FFD6DE on
  // plum, plum/inkSoft on cream & blush, ink on gold.
  const fg = tone === "onPlum" ? BRAND.white : tone === "onGold" ? BRAND.ink : BRAND.plum;
  const sub = tone === "onPlum" ? "#FFD6DE" : tone === "onGold" ? BRAND.ink : BRAND.inkSoft;
  return `<div style="display:flex;justify-content:space-between;align-items:center;padding:0 80px;height:120px">
    <div>
      <span style="font-family:${SERIF};font-size:34px;font-weight:bold;color:${fg}">Benjamin Rose</span>
      <span style="font-family:${SANS};font-size:22px;color:${sub}"> HOUSING</span>
    </div>
    <span style="font-family:${SANS};font-size:22px;color:${sub}">🏠 Equal Housing Opportunity</span>
  </div>`;
}

function card(bg: string, inner: string, tone: FooterTone): string {
  return `<div xmlns="http://www.w3.org/1999/xhtml" style="width:1080px;height:1080px;background:${bg};display:flex;flex-direction:column;box-sizing:border-box">
    <div style="flex:1;display:flex;flex-direction:column;justify-content:center;padding:80px">${inner}</div>
    ${footerBar(tone)}
  </div>`;
}

function pill(label: string, bg: string, fg = BRAND.white): string {
  return `<div style="display:inline-block;background:${bg};color:${fg};font-family:${SANS};font-size:30px;font-weight:bold;padding:22px 44px;border-radius:14px;margin-top:48px;align-self:flex-start">${esc(label)}</div>`;
}

/** Derive up to 4 social cards from a designed newsletter. */
export function deriveSocialCards(design: NewsletterDoc): SocialCard[] {
  const cards: SocialCard[] = [];

  const hero = design.sections.find((s) => s.kind === "hero");
  if (hero && hero.kind === "hero") {
    cards.push({
      id: "hero",
      label: "Headline",
      html: card(
        BRAND.plum,
        `${hero.kicker ? `<div style="font-family:${SANS};font-size:26px;font-weight:bold;letter-spacing:5px;color:${BRAND.gold};text-transform:uppercase;margin-bottom:36px">${esc(hero.kicker)}</div>` : ""}
         <div style="font-family:${SERIF};font-size:76px;line-height:1.12;font-weight:bold;color:${BRAND.white}">${esc(hero.headline)}</div>
         <div style="font-family:${SANS};font-size:32px;line-height:1.5;color:#FFE3E9;margin-top:40px">${esc(hero.intro)}</div>
         ${pill("Free classes → benrose.org", BRAND.rose)}`,
        "onPlum",
      ),
    });
  }

  const stat = design.sections.find((s) => s.kind === "stat");
  if (stat && stat.kind === "stat") {
    cards.push({
      id: "stat",
      label: "Big number",
      html: card(
        BRAND.blush,
        `<div style="text-align:center">
           <div style="font-family:${SERIF};font-size:300px;line-height:1;font-weight:bold;color:${BRAND.rose}">${esc(stat.value)}</div>
           <div style="font-family:${SANS};font-size:44px;font-weight:bold;color:${BRAND.plum};margin-top:36px;line-height:1.3">${esc(stat.label)}</div>
           ${stat.caption ? `<div style="font-family:${SANS};font-size:30px;color:${BRAND.inkSoft};margin-top:24px">${esc(stat.caption)}</div>` : ""}
         </div>`,
        "onLight",
      ),
    });
  }

  const program = design.sections.find((s) => s.kind === "program");
  if (program && program.kind === "program") {
    cards.push({
      id: "program",
      label: "Assistance spotlight",
      html: card(
        BRAND.cream,
        `<div style="border-left:20px solid ${BRAND.rose};padding-left:56px">
           <div style="font-family:${SANS};font-size:26px;font-weight:bold;letter-spacing:5px;color:${BRAND.rose};text-transform:uppercase;margin-bottom:32px">Assistance spotlight</div>
           <div style="font-family:${SERIF};font-size:64px;line-height:1.15;font-weight:bold;color:${BRAND.ink}">${esc(program.name)}</div>
           <div style="font-family:${SANS};font-size:34px;color:${BRAND.inkSoft};margin-top:28px">${esc(program.provider)}</div>
           <div style="display:inline-block;background:${BRAND.gold};color:${BRAND.ink};font-family:${SANS};font-size:38px;font-weight:bold;padding:20px 40px;border-radius:14px;margin-top:40px">${esc(program.amount)}</div>
           <div style="font-family:${SANS};font-size:30px;line-height:1.5;color:${BRAND.ink};margin-top:40px">${esc(program.blurb)}</div>
         </div>`,
        "onLight",
      ),
    });
  }

  const classCta = design.sections.find((s) => s.kind === "classCta");
  if (classCta && classCta.kind === "classCta") {
    cards.push({
      id: "classes",
      label: "Classes",
      html: card(
        BRAND.gold,
        `<div style="font-family:${SERIF};font-size:72px;line-height:1.15;font-weight:bold;color:${BRAND.ink}">${esc(classCta.title)}</div>
         <div style="font-family:${SANS};font-size:34px;line-height:1.5;color:${BRAND.ink};margin-top:40px">${esc(classCta.body)}</div>
         ${pill(classCta.buttonLabel + " → benrose.org", BRAND.plum)}`,
        "onGold",
      ),
    });
  }

  return cards;
}

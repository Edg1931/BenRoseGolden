import { describe, expect, it } from "vitest";
import { deriveSocialCards } from "./social";
import { curatedArticles, CURATED_ARTICLES } from "./articles";
import { ARTICLE_TOPICS } from "./article-topics";
import { seedCampaigns } from "./seed";
import { renderNewsletterHtml, newsletterDocSchema } from "./newsletter";

describe("deriveSocialCards", () => {
  const design = seedCampaigns.find((c) => c.id === "cm-welcome-newsletter")!.design!;
  const cards = deriveSocialCards(design);

  it("derives the four flagship cards from the welcome issue", () => {
    expect(cards.map((c) => c.id)).toEqual(["hero", "stat", "program", "classes"]);
  });

  it("emits self-contained 1080px XHTML with the brand palette and Equal Housing mark", () => {
    for (const c of cards) {
      expect(c.html).toContain('xmlns="http://www.w3.org/1999/xhtml"');
      expect(c.html).toContain("width:1080px");
      expect(c.html).toContain("Equal Housing Opportunity");
      expect(c.html).not.toContain("<script");
      expect(c.html).not.toMatch(/src=/);
    }
  });

  it("escapes content into the card markup", () => {
    const doc = newsletterDocSchema.parse({
      subject: "s",
      sections: [{ kind: "hero", headline: "A <b>bold</b> claim", intro: "x" }],
    });
    const [heroCard] = deriveSocialCards(doc);
    expect(heroCard.html).toContain("A &lt;b&gt;bold&lt;/b&gt; claim");
  });
});

describe("article library", () => {
  it("covers every topic area with real https resources", () => {
    for (const topic of ARTICLE_TOPICS) {
      const items = CURATED_ARTICLES[topic];
      expect(items.length).toBeGreaterThan(0);
      for (const a of items) {
        expect(() => new URL(a.url)).not.toThrow();
        expect(new URL(a.url).protocol).toBe("https:");
        expect(a.source.length).toBeGreaterThan(1);
      }
    }
  });

  it("dedupes across topics and respects topic selection", () => {
    const all = curatedArticles([]);
    expect(new Set(all.map((a) => a.url)).size).toBe(all.length);
    const seniors = curatedArticles(["seniors-families"]);
    expect(seniors.some((a) => a.source === "Benjamin Rose")).toBe(true);
    expect(seniors.some((a) => a.source === "CHN Housing Partners")).toBe(false);
  });
});

describe("reads section", () => {
  it("renders curated reading with source pills and links", () => {
    const doc = newsletterDocSchema.parse({
      subject: "s",
      sections: [
        {
          kind: "reads",
          title: "Worth your time this month",
          items: [
            { title: "Guide", source: "CFPB", url: "https://example.gov/guide", note: "Why read it" },
          ],
        },
      ],
    });
    const html = renderNewsletterHtml(doc);
    expect(html).toContain("Worth your time this month");
    expect(html).toContain('href="https://example.gov/guide"');
    expect(html).toContain("CFPB");
    expect(html).toContain("Why read it");
  });
});

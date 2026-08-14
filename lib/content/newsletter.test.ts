import { describe, expect, it } from "vitest";
import {
  newsletterDocSchema,
  renderNewsletterHtml,
  renderNewsletterText,
  type NewsletterDoc,
} from "./newsletter";
import { seedCampaigns } from "./seed";

const doc: NewsletterDoc = {
  subject: "Test issue",
  preheader: "A peek inside",
  sections: [
    { kind: "hero", kicker: "Kick", headline: "Big <Headline>", intro: "Hello there." },
    { kind: "stat", value: "35%", label: "of your score is payment history" },
    {
      kind: "article",
      title: "Do the thing",
      paragraphs: ["First paragraph."],
      cta: { label: "Start", url: "/learn/start" },
    },
    { kind: "checklist", title: "This month", items: ["One", "Two"] },
    {
      kind: "program",
      name: "OHFA Your Choice!",
      provider: "OHFA",
      amount: "2.5% or 5%",
      blurb: "Real help.",
      url: "/assistance",
    },
    { kind: "classCta", title: "Free classes", body: "Join us.", buttonLabel: "Go", url: "/learn/start" },
    {
      kind: "sponsor",
      institutionName: "Third Federal",
      tierLabel: "Featured partner",
      blurb: "A partner lender.",
      offers: [{ name: "DPA Grant", amount: "Up to $10,000" }],
      website: "https://example.com",
    },
    { kind: "quote", text: "It worked.", attribution: "A graduate" },
  ],
};

describe("renderNewsletterHtml", () => {
  const html = renderNewsletterHtml(doc);

  it("is a self-contained email document with no scripts or external assets", () => {
    expect(html).toContain("<!DOCTYPE html>");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("<link");
    expect(html).not.toMatch(/src=/);
  });

  it("escapes user-authored text", () => {
    expect(html).toContain("Big &lt;Headline&gt;");
    expect(html).not.toContain("Big <Headline>");
  });

  it("carries the brand palette", () => {
    expect(html).toContain("#D8183B"); // rose
    expect(html).toContain("#891A2E"); // plum
    expect(html).toContain("#F5800A"); // gold
  });

  it("renders every section", () => {
    for (const needle of [
      "Kick",
      "35%",
      "Do the thing",
      "This month",
      "OHFA Your Choice!",
      "Free classes",
      "Third Federal",
      "Up to $10,000",
      "It worked.",
    ]) {
      expect(html).toContain(needle);
    }
  });

  it("labels the sponsor and adds the partner + Equal Housing disclosures", () => {
    expect(html).toContain("Featured partner");
    expect(html).toContain("Partner spotlights");
    expect(html).toContain("Equal Housing Opportunity");
  });

  it("absolutizes site-relative links when a site URL is given", () => {
    const abs = renderNewsletterHtml(doc, { siteUrl: "https://example.org/" });
    expect(abs).toContain('href="https://example.org/learn/start"');
    expect(abs).not.toContain('href="/learn/start"');
  });

  it("omits the partner disclosure when no sponsor is present", () => {
    const noSponsor = { ...doc, sections: doc.sections.filter((s) => s.kind !== "sponsor") };
    expect(renderNewsletterHtml(noSponsor)).not.toContain("Partner spotlights");
  });
});

describe("renderNewsletterText", () => {
  it("produces a readable plain-text alternative", () => {
    const text = renderNewsletterText(doc);
    expect(text).toContain("BIG <HEADLINE>");
    expect(text).toContain("✓ One");
    expect(text).toContain("Equal Housing");
  });
});

describe("seeded welcome campaign", () => {
  it("carries a schema-valid design", () => {
    const welcome = seedCampaigns.find((c) => c.id === "cm-welcome-newsletter");
    expect(welcome?.design).toBeDefined();
    expect(newsletterDocSchema.safeParse(welcome!.design).success).toBe(true);
  });

  it("renders without throwing and includes its partner spotlight", () => {
    const welcome = seedCampaigns.find((c) => c.id === "cm-welcome-newsletter")!;
    const html = renderNewsletterHtml(welcome.design!);
    expect(html).toContain("Third Federal");
    expect(html).toContain("Equal Housing Opportunity");
  });
});

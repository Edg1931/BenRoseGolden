import { describe, expect, it } from "vitest";
import { classifySource, sourceWarning } from "./source-quality";
import { sanitizeEchoContent } from "./agent";
import { candidateProgramSchema } from "./schema";

describe("classifySource", () => {
  it("treats government domains as official", () => {
    expect(classifySource("https://www.hud.gov/program")).toBe("official");
    expect(classifySource("https://cuyahogacounty.us/dpa")).toBe("official");
    expect(classifySource("https://development.ohio.gov/x")).toBe("official");
  });

  it("knows OHFA lives on ohiohome.org", () => {
    expect(classifySource("https://www.ohiohome.org/homebuyers")).toBe("official");
  });

  it("treats .org as likely-official (agencies and nonprofits)", () => {
    expect(classifySource("https://www.chnhousingpartners.org/x")).toBe("likely-official");
  });

  it("flags commercial domains", () => {
    expect(classifySource("https://some-lender.com/dpa-blog")).toBe("unofficial");
    expect(classifySource("not a url")).toBe("unofficial");
  });
});

describe("sourceWarning", () => {
  it("is silent for official sources", () => {
    expect(sourceWarning("https://ohiohome.org/x")).toBeNull();
    expect(sourceWarning("https://a.org/x")).toBeNull();
  });

  it("names the suspect domain for the reviewer", () => {
    expect(sourceWarning("https://blog.lender.com/x")).toContain("blog.lender.com");
  });
});

describe("sanitizeEchoContent", () => {
  const text = { type: "text", text: "hi" };
  const thinking = { type: "thinking" };
  const toolUse = { type: "tool_use", id: "t1" };
  const search = { type: "server_tool_use", id: "s1" };
  const searchResult = { type: "web_search_tool_result", tool_use_id: "s1" };
  const orphanSearch = { type: "server_tool_use", id: "s2" };
  const fallback = { type: "fallback" };

  it("is the identity when no fallback occurred", () => {
    const content = [thinking, text, toolUse];
    expect(sanitizeEchoContent(content)).toEqual(content);
  });

  it("strips model-internal blocks before the fallback boundary", () => {
    const out = sanitizeEchoContent([
      thinking,
      text,
      search,
      searchResult,
      orphanSearch,
      toolUse,
      fallback,
      thinking,
      text,
    ]);
    // Before boundary: text + paired search survive; thinking, orphan search,
    // and tool_use are dropped. After boundary: untouched.
    expect(out).toEqual([text, search, searchResult, fallback, thinking, text]);
  });
});

describe("candidate schema still accepts a full agent payload", () => {
  it("parses a representative candidate", () => {
    const parsed = candidateProgramSchema.safeParse({
      name: "OHFA Your Choice! Down Payment Assistance",
      provider: "Ohio Housing Finance Agency",
      level: "state",
      geography: { statewide: true },
      assistanceType: "forgivable_loan",
      amount: "2.5% or 5% of purchase price",
      eligibility: { incomeLimit: "Varies by county (OHFA limits)", creditMin: 640 },
      requiresHomebuyerEd: true,
      howToApply: "Apply through an OHFA-approved lender.",
      sourceUrl: "https://www.ohiohome.org/homebuyers/downpayment.aspx",
      lastVerified: "2026-08-14",
      confidence: "high",
      reviewerNote: "Verified on the OHFA homebuyer page.",
    });
    expect(parsed.success).toBe(true);
  });
});

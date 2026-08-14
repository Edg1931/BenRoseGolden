import type { Campaign, ContentItem } from "./schema";
import type { NewsletterDoc } from "./newsletter";

/**
 * The seeded welcome issue as a DESIGNED newsletter, so the campaign page and
 * demo show the branded email — hero, stat graphic, program card, class CTA,
 * and a labeled partner spotlight — without needing an AI key.
 */
const welcomeDesign: NewsletterDoc = {
  subject: "Your path to a stable home starts here",
  preheader: "Free classes, real down-payment help, and a team that speaks your language.",
  sections: [
    {
      kind: "hero",
      kicker: "Welcome to Benjamin Rose Housing",
      headline: "You're closer to your own keys than you think",
      intro:
        "Whether you're buying your first home, rebuilding credit, or protecting the home you have — you don't have to figure it out alone. Here's how we help, free.",
    },
    {
      kind: "stat",
      value: "$0",
      label: "What our classes, counseling, and certificate cost you",
      caption: "Free, HUD-approved, and yours to keep.",
    },
    {
      kind: "article",
      emoji: "🏠",
      title: "The one document that unlocks the money",
      paragraphs: [
        "Most Ohio down-payment-assistance programs share one requirement: a certificate from a HUD-approved homebuyer education course. Finish our four free classes and that certificate is yours — and with it, programs offering thousands toward your down payment and closing costs.",
        "The classes are online, self-paced, and in your language. Most people finish in about eight hours.",
      ],
      cta: { label: "Start Day 1 free", url: "/learn/start" },
    },
    {
      kind: "checklist",
      title: "Do these 5 things this month",
      items: [
        "Pull your free credit report at annualcreditreport.com and check for errors",
        "Start a house fund — even $25 a paycheck builds the habit",
        "Finish Day 1: Money Management & Understanding Credit",
        "Add your income and county to your profile for assistance matching",
        "Ask your counselor which programs your certificate will unlock",
      ],
    },
    {
      kind: "program",
      name: "OHFA Your Choice! Down Payment Assistance",
      provider: "Ohio Housing Finance Agency",
      amount: "2.5% or 5% of purchase price",
      blurb:
        "One of the programs your class certificate unlocks. Your counselor can check your eligibility in minutes.",
      url: "/assistance",
    },
    {
      kind: "classCta",
      title: "Four free classes. One certificate. Real money.",
      body: "Finish our HUD-approved course — about 8 hours, online, at your pace — and earn the certificate that assistance programs across Ohio ask for.",
      buttonLabel: "Take the free classes",
      url: "/learn/start",
    },
    {
      kind: "sponsor",
      institutionName: "Third Federal Savings & Loan",
      contactName: "Dana Whitfield",
      tierLabel: "Featured partner",
      blurb:
        "A Golden Group partner lender helping our graduates put their certificates to work.",
      offers: [
        { name: "Home Today Program", amount: "Below-market fixed rate" },
        { name: "Down-Payment Assistance Grant", amount: "Up to $10,000" },
      ],
      website: "https://www.thirdfederal.com",
    },
    {
      kind: "quote",
      text: "I thought owning a home was for other people. The classes broke it into steps, and the steps were doable.",
      attribution: "A recent Benjamin Rose graduate",
    },
  ],
};

/** Sample multi-format / multi-language learning assets tied to modules. */
export const seedContent: ContentItem[] = [
  { id: "ct-budget-en-audio", title: "Budgeting & Money Management — Audiobook", moduleId: "budgeting", track: "first-time-buyer", format: "audio", language: "en", summary: "Full audio walkthrough of building a household budget.", durationMin: 28, tags: ["budgeting"], lastUpdated: "2026-05-01" },
  { id: "ct-budget-es-audio", title: "Presupuesto y Manejo del Dinero — Audiolibro", moduleId: "budgeting", track: "first-time-buyer", format: "audio", language: "es", summary: "Guía en audio para crear un presupuesto familiar.", durationMin: 30, tags: ["budgeting", "spanish"], lastUpdated: "2026-05-01" },
  { id: "ct-credit-en-slides", title: "Understanding Credit — Interactive Slideshow", moduleId: "credit-basics", track: "first-time-buyer", format: "slideshow", language: "en", summary: "Self-paced slides explaining credit scores and how to improve them.", tags: ["credit"], lastUpdated: "2026-05-03" },
  { id: "ct-credit-podcast", title: "Credit 101 — Podcast Episode", moduleId: "credit-basics", track: "credit-repair", format: "podcast", language: "en", summary: "Conversational episode on building and repairing credit.", durationMin: 22, tags: ["credit", "podcast"], lastUpdated: "2026-04-20" },
  { id: "ct-mortgage-video", title: "Understanding Mortgages — Video", moduleId: "mortgages", track: "first-time-buyer", format: "video", language: "en", summary: "Animated explainer of mortgage types and financing.", durationMin: 15, tags: ["mortgage"], lastUpdated: "2026-05-10" },
  { id: "ct-mortgage-pdf-ar", title: "فهم الرهن العقاري — PDF", moduleId: "mortgages", track: "first-time-buyer", format: "pdf", language: "ar", summary: "Arabic-language PDF guide to mortgages.", tags: ["mortgage", "arabic"], lastUpdated: "2026-05-10" },
  { id: "ct-closing-largeprint", title: "The Closing Process — Large Print Guide", moduleId: "closing", track: "first-time-buyer", format: "large-print", language: "en", summary: "Accessible large-print walkthrough of closing day.", tags: ["closing", "accessibility"], lastUpdated: "2026-05-12" },
  { id: "ct-foreclosure-audio", title: "Understanding Mortgage Default — Audiobook", moduleId: "default-basics", track: "foreclosure-prevention", format: "audio", language: "en", summary: "What happens in default and your options.", durationMin: 18, tags: ["foreclosure"], lastUpdated: "2026-04-15" },
  { id: "ct-lossmit-slides", title: "Loss Mitigation Options — Slideshow", moduleId: "loss-mitigation", track: "foreclosure-prevention", format: "slideshow", language: "en", summary: "Forbearance, modification, and other servicer options.", tags: ["foreclosure"], lastUpdated: "2026-04-18" },
  { id: "ct-creditrepair-video", title: "Repairing & Building Credit — Video", moduleId: "credit-repair", track: "credit-repair", format: "video", language: "en", summary: "Step-by-step plan to raise your score toward DPA eligibility.", durationMin: 20, tags: ["credit"], lastUpdated: "2026-05-05" },
  { id: "ct-savings-podcast", title: "Building Savings — Podcast", moduleId: "building-savings", track: "financial-coaching", format: "podcast", language: "en", summary: "Practical saving strategies on a tight budget.", durationMin: 19, tags: ["savings"], lastUpdated: "2026-04-28" },
  { id: "ct-maintenance-pdf", title: "Home Maintenance Basics — PDF", moduleId: "home-maintenance", track: "post-purchase", format: "pdf", language: "en", summary: "Seasonal maintenance checklist for new homeowners.", tags: ["post-purchase"], lastUpdated: "2026-05-02" },
];

/** A couple of sample campaigns so the marketing view isn't empty. */
export const seedCampaigns: Campaign[] = [
  {
    id: "cm-welcome-newsletter",
    type: "newsletter",
    title: "Welcome to Benjamin Rose Housing",
    subject: "Your path to a stable home starts here",
    audience: { stages: ["lead", "enrolled"] },
    language: "en",
    bodyMarkdown: "# Welcome!\n\nThank you for your interest in Benjamin Rose's housing programs. Each month we'll share tips, class schedules, and the assistance you may qualify for.\n\n- Free HUD-approved homebuyer education\n- Foreclosure-prevention counseling\n- Credit-building coaching\n\nReply anytime — we're here to help.",
    design: welcomeDesign,
    status: "ready",
    createdAt: "2026-05-01",
    updatedAt: "2026-05-01",
  },
];

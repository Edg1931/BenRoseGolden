import Link from "next/link";
import { Composer, type SponsorOption } from "@/components/content/composer";
import { getNewsletterSources, getLenderFeedItems } from "@/lib/content/feed";
import { listLenders } from "@/lib/lenders/repository";
import { LENDER_TIER_LABELS } from "@/lib/lenders/schema";

export default async function ComposePage() {
  const [articles, lenderFeed, lenders] = await Promise.all([
    getNewsletterSources(),
    getLenderFeedItems(),
    listLenders(),
  ]);
  const sources = [...articles, ...lenderFeed];

  // Partner slots: featured first, then preferred, then the rest.
  const tierRank = { featured: 0, preferred: 1, standard: 2 } as const;
  const sponsors: SponsorOption[] = lenders
    .slice()
    .sort((a, b) => tierRank[a.tier] - tierRank[b.tier])
    .map((l) => ({
      id: l.id,
      name: l.institutionName,
      tierLabel: LENDER_TIER_LABELS[l.tier],
      featured: l.tier !== "standard",
    }));

  return (
    <div className="space-y-4">
      <div>
        <Link href="/content" className="text-sm text-muted-foreground hover:underline">
          ← Back to content
        </Link>
        <h1 className="mt-1 text-xl font-semibold tracking-tight">Compose with AI</h1>
        <p className="text-sm text-muted-foreground">
          Claude reads the site&apos;s classes, assistance programs, and partner directory, then
          designs an on-brand issue you can preview exactly as clients will see it.
        </p>
      </div>
      <Composer sources={sources} sponsors={sponsors} />
    </div>
  );
}

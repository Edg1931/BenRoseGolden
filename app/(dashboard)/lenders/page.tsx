import Link from "next/link";
import { listLenders } from "@/lib/lenders/repository";
import { LendersDirectory } from "@/components/lenders/lenders-directory";
import { Card } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function LendersPage() {
  const lenders = await listLenders();
  const featured = lenders.filter((l) => l.tier === "featured").length;
  const advertising = lenders.filter((l) => l.advertising).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Preferred Lenders</h1>
          <p className="text-sm text-muted-foreground">
            Partner lenders we refer clients to and feature in our marketing — with the languages
            they serve and the assistance programs they offer.
          </p>
        </div>
        <Link href="/lenders/new" className="rounded-md bg-brand-rose px-3 py-2 text-sm font-medium text-white hover:bg-brand-plum">
          + Add lender
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Lenders" value={lenders.length} accent />
        <Stat label="Featured partners" value={featured} />
        <Stat label="Advertising" value={advertising} />
        <Stat label="Take referrals" value={lenders.filter((l) => l.receivesReferrals).length} />
      </div>

      <LendersDirectory lenders={lenders} />
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <Card className="px-4 py-3">
      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className={"mt-1 text-2xl font-semibold " + (accent ? "text-brand-rose" : "")}>{value}</div>
    </Card>
  );
}

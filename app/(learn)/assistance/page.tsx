import { AssistanceFinder } from "@/components/learn/assistance-finder";
import { amiSupportedCounties } from "@/lib/programs/ami";
import { loadAllPrograms } from "@/lib/programs/sources";
import { datasetFreshness } from "@/lib/programs/freshness";
import { formatDate } from "@/lib/utils";

export const metadata = {
  title: "Find Down-Payment Assistance — Benjamin Rose Housing",
  description:
    "Answer a few questions and see which Ohio down-payment assistance programs you may qualify for — grants, forgivable loans, and more, up to $30,000.",
};

export const dynamic = "force-dynamic";

/** Public, self-serve Ohio assistance finder built on the staff matching engine. */
export default async function AssistancePage() {
  const programs = await loadAllPrograms();
  const counties = amiSupportedCounties().sort();
  const freshness = datasetFreshness(programs);

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <div className="mx-auto mb-6 max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-rose">
          Free • No sign-up needed
        </p>
        <h1 className="mt-2 font-serif text-3xl font-bold text-brand-plum sm:text-4xl">
          Find your down-payment assistance
        </h1>
        <p className="mt-3 text-muted-foreground">
          We track {programs.length} Ohio programs — grants, forgivable loans, and more. Answer a
          few questions and see what you may qualify for, with plain-language reasons and exact
          next steps.
        </p>
        {freshness.newestVerified && (
          <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-brand-blush px-3 py-1 text-xs font-medium text-brand-plum">
            <span aria-hidden>🔄</span>
            Reviewed regularly · most recent check {formatDate(freshness.newestVerified)}. Each
            result shows its own last-verified date.
          </p>
        )}
      </div>
      <AssistanceFinder counties={counties} />
    </main>
  );
}

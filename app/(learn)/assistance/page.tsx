import { AssistanceFinder } from "@/components/learn/assistance-finder";
import { AmiVintageNote } from "@/components/programs/ami-vintage-note";
import { AssistanceIntro } from "@/components/learn/assistance-intro";
import { LangProvider } from "@/components/i18n/lang-provider";
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
      <LangProvider>
        <AssistanceIntro
          programCount={programs.length}
          newestVerified={freshness.newestVerified ? formatDate(freshness.newestVerified) : undefined}
        />
        <AssistanceFinder counties={counties} />
        <div className="mt-6">
          <AmiVintageNote />
        </div>
      </LangProvider>
    </main>
  );
}

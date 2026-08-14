import Link from "next/link";
import { amiSupportedCounties } from "@/lib/programs/ami";
import { NewClientForm } from "@/components/participants/new-client-form";

export const dynamic = "force-dynamic";

/**
 * Add a single client by hand — the counterpart to the mass import, for the
 * person who just walked in or called.
 */
export default async function NewClientPage({
  searchParams,
}: {
  searchParams: Promise<{ added?: string }>;
}) {
  const { added } = await searchParams;
  const counties = amiSupportedCounties().sort();

  return (
    <div className="space-y-5">
      <div>
        <Link href="/contacts" className="text-sm text-muted-foreground hover:underline">
          ← Back to clients
        </Link>
        <h1 className="mt-1 text-xl font-semibold tracking-tight">Add a client</h1>
        <p className="text-sm text-muted-foreground">
          Everything here feeds the assistance matching — the more you capture, the better the
          program recommendations on their profile.
        </p>
      </div>

      {added && (
        <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          Saved {added}. Ready for the next one.
        </p>
      )}

      <NewClientForm counties={counties} />
    </div>
  );
}

import Link from "next/link";
import { ImportWizard } from "@/components/participants/import-wizard";

export default function ImportPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div>
        <Link href="/contacts" className="text-sm text-muted-foreground hover:underline">
          ← Back to clients
        </Link>
        <h1 className="mt-1 text-xl font-semibold tracking-tight">Mass import clients</h1>
        <p className="text-sm text-muted-foreground">
          Bring in the thousands of people who have already gone through a Benjamin Rose program.
        </p>
      </div>
      <ImportWizard />
    </div>
  );
}
